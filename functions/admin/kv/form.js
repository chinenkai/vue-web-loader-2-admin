import kv from "./init.js"
class form extends kv {
    constructor(context) {
        super(context, 'form');
    }

    async check_post_data(data) {
        if (data.name === undefined || data.name === '') {
            return await this.exit_json('name参数错误');
        }

        if (data.value === undefined) {
            return await this.exit_json('value参数错误');
        }

        return data;
    }

    async get_data(cur_kvalue, param) {

        const field = param.formField;
        const name = param.formValue;

        let value = await cur_kvalue.get(name);

        return [1, '获取数据成功', {
            formData: {
                name: name,
                value: value,
            }
        }];
    }

    async edit_data(cur_kvalue, param) {

        let data = await this.check_post_data(param.data);

        try {
            await cur_kvalue.put(data.name, data.value);
            return [1, '提交成功'];
        } catch (e) {
            return [0, '提交失败'];
        }
    }

    async add_data(cur_kvalue, param) {

        let data = await this.check_post_data(param.data);

        try {
            await cur_kvalue.put(data.name, data.value);
            return [1, '提交成功'];
        } catch (e) {
            return [0, '提交失败'];
        }
    }

    async respond() {
        // 检查用户是否重复登录
        await this.auto_check_login();

        const param = JSON.parse(this._post['param']);

        const cur_kvalue = this.kvalue('');
        let result = [];

        if (param.formAction === 'get') {
            result = await this.get_data(cur_kvalue, param);
        } else if (param.formAction === 'set') {
            result = await this.edit_data(cur_kvalue, param);
        } else {
            result = await this.add_data(cur_kvalue, param);
        }

        return this.send_json(...result);

    }
}
export async function onRequest(context) {
    return await new form(context).init();
}