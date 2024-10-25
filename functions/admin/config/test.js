import config from "./init.js"
class test extends config {
    constructor(context) {
        super(context, 'test');
    }

    async respond() {
        // 检查用户是否重复登录
        await this.auto_check_login();

        // 业务代码
    }
}
export async function onRequest(context) {
    return await new test(context).init();
}