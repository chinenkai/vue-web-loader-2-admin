import kv from "./init.js"
class del extends kv {
    constructor(context) {
        super(context, 'del');
    }

    async respond() {
        // 检查用户是否重复登录
        await this.auto_check_login();

        const action = this._get['action'];

        const param = JSON.parse(this._post['param']);
        const field = param.field;
        const name = param.data;

        const cur_kvalue = this.kvalue('');

        await cur_kvalue.delete(name);

        // 通过get判断是否删除成功
        let value = await cur_kvalue.get(name);

        if (value === null) {
            // 删除成功
            return this.send_json(1, '删除成功');
        }

        return this.send_json(1, '删除失败');
    }
}
export async function onRequest(context) {
    return await new del(context).init();
}