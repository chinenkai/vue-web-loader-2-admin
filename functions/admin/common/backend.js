import base from "../../core/base.js"
import card from "./card.js"
import table from "./table.js"
import batch from "./batch.js"
import action from "./action.js"
import form from "./form.js"
class backend extends base {
    constructor(context, controller, action) {
        super(context, controller, action);
        this.manager_data = null;
    }

    async logs_error(msg) {
        let logs_model = this.model('logs');
        let uid = this.manager_data && this.manager_data['id'] ? this.manager_data['id'] : 0;
        let username = this.manager_data && this.manager_data['username'] ? this.manager_data['username'] : '';

        let re = await logs_model.create({
            uid: uid,
            username: username,
            controller: this._controller ? this._controller : 'default',
            action: this._action ? this._action : 'default',
            ip: this._get_ip(),
            remark: msg,
            createtime: this.time(),
            updatetime: this.time(),
        });
    }

    async check_login() {

        let result = {
            status: 0,
            msg: '',
        };

        // 判断是否已登录
        const uid = this._token.get('uid');

        if (!uid) {
            result.msg = '[check_login]用户未登录';
            return result;
        }

        const manager_model = this.model('manager');
        // 从数据库获取用户数据
        const manager_data = await manager_model.one({ id: uid });

        if (!manager_data) {
            result.msg = '[check_login]用户不存在';
            return result;
        }

        this.manager_data = manager_data;
        await this.logs_error('');
        result.status = 1;
        return result;
    }

    async auto_check_login() {
        let result = await this.check_login();
        if (result.status === 0) {
            this.exit_json(2, '用户未登录');
            return false;
        }
        return true;
    }

    async respond() {
        // 判断是否登录
        await this.auto_check_login();
        // 处理数据
        const result = await this._respone();
        // 返回响应
        return this.send_json(...result);
    }

    async _respone() {

        const args = {
            _ctx: this._ctx,
            _controller: this._controller,
            _action: this._action,
            _db: this._db,
            _kv: this._kv,
            _get: this._get,
            _post: this._post,
            _headers: this._headers,
            _hook: this._hook,
            _token: this._token,
            _setting: this._setting,
        }

        if (this._get['do'] == 'card') {
            return await new card(args).respond();
        }

        if (this._get['do'] == 'table') {
            return await new table(args).respond();
        }

        if (this._get['do'] == 'batch') {
            return await new batch(args).respond();
        }

        if (this._get['do'] == 'action') {
            return await new action(args).respond();
        }

        if (this._get['do'] == 'form') {
            return await new form(args).respond();
        }

        return [0, '未定义默认处理接口', null];
    }
}
export default backend
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}