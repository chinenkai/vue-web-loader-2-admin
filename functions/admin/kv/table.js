import { time, is_json } from '../../core/utils.js';
import lodash from "../../libs/lodash.js"

import kv from "./init.js"
class table extends kv {
    constructor(context) {
        super(context, 'table');
    }

    async respond() {
        // 检查用户是否重复登录
        await this.auto_check_login();

        const param = JSON.parse(this._post['param']);

        let result = {};
        if (param && param.hasSetting == 0) {
            result.tableColumn = this._setting.tableColumn;
            result.filterSetting = this._setting.filterSetting;
            result.batchSetting = this._setting.batchSetting;
            result.tableAction = this._setting.tableAction;
            result.formFields = this._setting.formFields;
        }

        const query = lodash.get(param, 'query', {});
        const page = lodash.get(query, 'page', 1);
        const pageSize = 1000;
        let tableData = [];
        let temp_kvalue = this.kvalue('kv');

        const args = { limit: pageSize };

        if (query.searchComparator && query.searchKeyword) {
            args['prefix'] = decodeURIComponent(query.searchKeyword);
        }


        let { keys, list_complete, cursor } = await this._kv.list(args);

        for (var i = 0; i < keys.length; i++) {

            let name = keys[i].name;

            let value = await this._kv.get(name);

            tableData.push({
                id: 'N/' + (i + 1),
                name: name,
                value: value,
            });
        }

        result.tableData = tableData;
        result.tableTotal = keys.length;
        result.pageSize = pageSize;

        return this.send_json(1, '获取数据成功', result);
    }
}
export async function onRequest(context) {
    return await new table(context).init();
}