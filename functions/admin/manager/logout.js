import manager from "./init.js"
class menus extends manager {
    constructor(context) {
        super(context, 'menus');
    }

    async respond() {
        // 检查用户是否重复登录
        await this.auto_check_login();

        this._token.set('uid',0);

        return this.send_json(2, '退出并刷新');
    }
}
export async function onRequest(context) {
    return await new menus(context).init();
}