import { time, is_json } from '../../core/utils.js';
import lodash from "../../libs/lodash.js"
import model from "../../core/model.js"
class form {
    constructor(args) {
        this._ctx = args._ctx;
        this._controller = args._controller;
        this._action = args._action;
        this._db = args._db;
        this._kv = args._kv;
        this._get = args._get;
        this._post = args._post;
        this._headers = args._headers;
        this._hook = args._hook;
        this._token = args._token;
        this._setting = args._setting;
    }

    formfields2sqlfields(formfields) {
        let list = [];
        for (var i = 0; i < formfields.length; i++) {
            list.push(formfields[i].name);
        }
        return list.join(',');
    }

    async check_post_data(data) {

        for (let key in data) {
            if (Array.isArray(data[key])) {
                data[key] = JSON.stringify(data[key]);
            }
        }

        data = await this._hook.emit(this._controller + '_form_check_post_data', data);

        return data;
    }

    async get_data(cur_model, param) {
        let result = {};
        const field = param.formField;
        const value = param.formValue;

        let formFields = this._setting.formFields;

        if (param.hasSetting == 0) {
            result.formFields = formFields;
        }

        formFields = await this._hook.emit(this._controller + '_form_get_fields', formFields);

        const condition = {
            [field]: value
        };

        result.formData = await cur_model.one(condition, this.formfields2sqlfields(formFields));

        for (let key in result.formData) {
            if (is_json(result.formData[key])) {
                result.formData[key] = JSON.parse(result.formData[key]);
            }
        }

        result.formData = await this._hook.emit(this._controller + '_form_get_data', result.formData);

        return [1, '获取数据成功', result];
    }

    async edit_data(cur_model, param) {
        const field = param.formField;
        const value = param.formValue;
        const condition = {
            [field]: value
        };

        let data = await this.check_post_data(param.data);

        if (!data.updatetime) {
            data.updatetime = time();
        }

        data = await this._hook.emit(this._controller + '_form_edit_data', data);

        const result = await cur_model.update(condition, data);

        if (result && result.success == true) {
            return [1, '提交成功'];
        }

        return [0, '提交失败'];
    }

    async add_data(cur_model, param) {

        let data = await this.check_post_data(param.data);

        if (!data.createtime) {
            data.createtime = time();
        }
        if (!data.updatetime) {
            data.updatetime = time();
        }

        data = await this._hook.emit(this._controller + '_form_add_data', data);

        const result = await cur_model.create(data);

        if (result && result.success == true) {
            return [1, '提交成功'];
        }

        return [0, '提交失败'];
    }
    async respond() {

        const param = JSON.parse(this._post['param']);

        const cur_model = new model(this._db, this._controller);

        if (param.formAction === 'get') {
            return await this.get_data(cur_model, param);
        }

        if (param.formAction === 'set') {
            return await this.edit_data(cur_model, param);
        }

        return await this.add_data(cur_model, param);
    }

}

export default form;
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}