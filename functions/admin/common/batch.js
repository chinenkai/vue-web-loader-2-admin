import { exit } from "../../core/exit.js"
import model from "../../core/model.js"
class batch {
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

    async check_post_data(data) {

        data = await this._hook.emit(this._controller + '_batch_check_post_data', data);

        return data;
    }

    async delete_data(cur_model, param) {

        const field = param.field;

        let data = await this.check_post_data(param.data);

        data = await this._hook.emit(this._controller + '_batch_delete_data', data);

        for (var i = 0; i < data.length; i++) {

            let re = await cur_model.delete({
                [field]: data[i]
            });
            if (!re || re.success != true) {
                exit(Response.json({
                    status: 0,
                    msg: '删除至[' + key + ']失败',
                }));
            }
        }

        return [1, '提交成功'];
    }

    async respond() {

        const action = this._get['action'];

        const param = JSON.parse(this._post['param']);

        const cur_model = new model(this._db, this._controller);

        if (action === 'delete') {
            return await this.delete_data(cur_model, param);
        }

        return [0, '没有指定操作行为'];

    }
}

export default batch;
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}