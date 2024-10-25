import CryptoJS from "../../libs/crypto-js.js"
import lodash from "../../libs/lodash.js"
import manager from "./init.js"
class login extends manager {
    constructor(context) {
        super(context, 'login');
    }

    async check_manager_password(username, password) {
        const manager_model = this.model('manager');

        let result = {
            status: 0
        };

        if (!username) {
            result.msg = "用户名不能为空";
            return result;
        }

        if (!password) {
            result.msg = "密码不能为空";
            return result;
        }

        const condition = {
            username: username
        };

        const user = await manager_model.one(condition);

        if (!user) {
            result.msg = '用户名错误';
            return result;
        }

        // 验证密码是否正确
        if (user.password != this.generate_password(password, user.factor)) {
            // 密码错误
            result.msg = "密码错误";
            return result;
        }

        // 保存到用户到返回数组
        result.user = user;

        result.msg = '';
        result.status = 1;

        return result;
    }

    async respond() {
        // 检查用户是否重复登录
        let result = await this.check_login();
        if (result.status === 1) {
            // 已经登录
            return this.send_json(1, '请勿重复登录');
        }

        const param = JSON.parse(this._post.param);

        const username = param.username ? lodash.escape(param.username) : '';
        const password = param.password ? param.password : '';

        result = await this.check_manager_password(username, password);

        if (result.status) {
            this._token.set('uid', result.user.id);
            return this.send_json(1, '登录成功');
        }

        return this.send_json(0, '登录失败', result.msg);
    }
}
export async function onRequest(context) {
    return await new login(context).init();
}