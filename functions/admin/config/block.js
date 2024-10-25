import { time, is_json } from '../../core/utils.js';
import lodash from "../../libs/lodash.js"
import config from "./init.js"
class block extends config {
    constructor(context) {
        super(context, 'block');
    }

    formfields2sqlfields(formfields) {
        return formfields.map(field => field.name).join(',');
    }

    async check_post_data(data) {

        for (let key in data) {
            if (Array.isArray(data[key])) {
                data[key] = JSON.stringify(data[key]);
            }
        }

        return data;
    }

    async get_data(cur_model, param) {
        let result = {
            'formData': {}
        };
        const field = param.formField;
        const value = param.formValue;


        const formFields = this._setting[value + 'Fields'];

        if (param.hasSetting === 0) {
            result.formFields = formFields;
        }

        for (var i = 0; i < formFields.length; i++) {

            let name = formFields[i]['name'];

            if(name === undefined){
                continue;
            }

            result.formData[name] = '';

            let condition = {
                [field]: value,
                'name': name,
            };

            let temp_data = await cur_model.one(condition);

            if (temp_data) {
                if (is_json(temp_data['value'])) {
                    result.formData[name] = JSON.parse(temp_data['value']);
                } else {
                    result.formData[name] = temp_data['value'];
                }
            }
        }

        return [1, '获取数据成功', result];
    }

    async edit_data(cur_model, param) {
        const field = param.formField;
        const value = param.formValue;

        let data = await this.check_post_data(param.data);

        for (let key in data) {

            let condition = {
                [field]: value,
                'name': key,
            };

            let re = null;

            let temp_data = await cur_model.one(condition);

            if (!temp_data) {
                re = await cur_model.create({
                    [field]: value,
                    'name': key,
                    'value': data[key],
                    'createtime': time(),
                    'updatetime': time(),
                });
            } else {

                if (temp_data['value'] === data[key]) {
                    continue;
                }

                re = await cur_model.update(condition, {
                    'value': data[key],
                    'updatetime': time(),
                })
            }

            if (!re || re.success != true) {
                this.exit_json({
                    status: 0,
                    msg: '更新[' + key + ']失败',
                });
            }
        }

        return [1, '提交成功'];
    }

    async respond() {
        // 检查用户是否重复登录
        await this.auto_check_login();

        // 业务代码

        const param = JSON.parse(this._post['param']);
        let result = [];

        const cur_model = this.model(this._controller);

        if (param.formAction === 'set' && param.formField) {
            result = await this.edit_data(cur_model, param);
        } else {
            result = await this.get_data(cur_model, param);
        }

        return this.send_json(...result);

    }
}
export async function onRequest(context) {
    return await new block(context).init();
}