import CryptoJS from "../../libs/crypto-js.js"
import lodash from "../../libs/lodash.js"

import backend from "../common/backend.js"
import tableColumn from "./setting/tableColumn.js"
import filterSetting from "./setting/filterSetting.js"
import batchSetting from "./setting/batchSetting.js"
import tableAction from "./setting/tableAction.js"
import formFields from "./setting/formFields.js"
class manager extends backend {
    constructor(context, action) {
        super(context, 'manager', action);
        this._setting = {
            tableColumn: tableColumn,
            filterSetting: filterSetting,
            batchSetting: batchSetting,
            tableAction: tableAction,
            formFields: formFields,
        }
    }

    generate_password(password, factor) {
        return CryptoJS.SHA256(CryptoJS.SHA256(password).toString() + factor).toString();
    }

    bind_hook() {

        var that = this;

        // 解决获取表单字段并查询数据时password2得问题
        this._hook.on(this._controller + '_form_get_fields', async function(fields) {
            let nfeilds = [];
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].name == 'password' || fields[i].name == 'password2') {
                    continue;
                }
                nfeilds.push(fields[i]);
            }
            return nfeilds;
        });

        // 被忽略的数据必须补回来，不然前端表单无法编辑
        this._hook.on(this._controller + '_form_get_data', async function(data) {
            data['password'] = '';
            data['password2'] = '';
            return data;
        });

        function create_password(password) {
            const factor = Math.random().toString(36).slice(-8);
            password = this.generate_password(password, factor);
            return {
                factor: factor,
                password: password
            }
        }

        // 创建或修改表单时，判断密码是否一致，并删除多余password2字段数据
        this._hook.on(this._controller + '_form_check_post_data', async function(data) {

            const param = JSON.parse(that._post['param']);

            const manager_model = that.model('manager');

            const temp_data = await manager_model.one({ username: data['username'] });

            // 新增
            if (param['formAction'] == 'add') {
                // 直接中断响应
                if (temp_data) {
                    return that.exit_json(0, '该用户名已被使用，请换一个用户名');
                }
                if (data['password'] === '') {
                    return that.exit_json(0, '请输入密码');
                }
                if (data['password2'] === '') {
                    return that.exit_json(0, '请输入重复密码');
                }
                if (data['password'] !== data['password2']) {
                    return that.exit_json(0, '密码不一致');
                }

                const { factor, password } = create_password(data['password']);
                data['factor'] = factor;
                data['password'] = password;
            }

            // 编辑
            if (param['formAction'] == 'set') {
                // 直接中断响应
                if (temp_data && temp_data[param['formField']] != param['formValue']) {
                    return that.exit_json(0, '该用户名已被使用，请换一个用户名');
                }

                // 只有当填写了密码时，才修改密码
                if (data['password'] !== '') {
                    if (data['password2'] === '') {
                        return that.exit_json(0, '请输入重复密码');
                    }
                    if (data['password'] !== data['password2']) {
                        return that.exit_json(0, '密码不一致');
                    }
                    const { factor, password } = create_password(data['password']);
                    data['factor'] = factor;
                    data['password'] = password;
                } else {
                    delete data['password'];
                }
            }

            delete data['password2'];

            return data;
        });

    }
}
export default manager
export async function onRequest(context) {
    return await new manager(context, 'init').init();
}