import { time, is_json } from '../../core/utils.js';
import lodash from "../../libs/lodash.js"
import model from "../../core/model.js"
class table {
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

    tablecolumn2sqlfields(tablecolumn) {
        let list = [];
        for (var i = 0; i < tablecolumn.length; i++) {
            list.push(tablecolumn[i].colKey);
        }
        return list.join(',');
    };

    async query2condition(query, filterSetting) {

        const default_condition = { 0: '`id` > :id', id: 0 }

        if (!query || Object.keys(query).length === 0) {
            return default_condition;
        }

        let condition = {};
        let sql = '';

        if (filterSetting) {

            for (const [k1, v1] of Object.entries(query)) {
                if (filterSetting.includes(k1)) {
                    const decodedV1 = decodeURIComponent(v1);
                    if (!decodedV1.includes('-')) {
                        const tempKey = `:${k1}`;
                        sql += (sql ? ' and' : '') + ` \`${k1}\` = ${tempKey}`;
                        condition[tempKey] = decodedV1;
                    } else {
                        const tempArr = decodedV1.split('-');
                        const tempStr = tempArr.map(item => `"${item}"`).join(',');
                        sql += (sql ? ' and' : '') + ` \`${k1}\` in(${tempStr})`;
                    }
                }
            }
        }

        if (query.searchDate) {
            const [startTime, endTime] = query.searchDate.split('-');
            sql += (sql ? ' and' : '') + ' `createtime` >= :searchDateStart and `createtime` <= :searchDateEnd';
            condition['searchDateStart'] = startTime / 1000;
            condition['searchDateEnd'] = endTime / 1000;
        }

        if (query.searchComparator && query.searchKeyword) {
            const word = decodeURIComponent(query.searchKeyword);
            const key = decodeURIComponent(query.searchField);
            const comparator = decodeURIComponent(query.searchComparator);

            if (comparator === 'LIKE' || comparator === 'LIKE %') {
                sql += (sql ? ' and' : '') + ` \`${key}\` LIKE :searchKeyword`;
                condition['searchKeyword'] = comparator === 'LIKE %' ? `%${word}%` : word;
            } else if (comparator === 'IN') {
                const tempArr = word.split(',');
                const tempStr = tempArr.map(item => `"${item}"`).join(',');
                sql += (sql ? ' and' : '') + ` \`${key}\` in(${tempStr})`;
            } else {
                sql += (sql ? ' and' : '') + ` \`${key}\` ${comparator} :searchKeyword`;
                condition['searchKeyword'] = word;
            }
        }

        if (sql) {
            condition[0] = sql;
        } else {
            condition = default_condition;
        }

        return condition;
    }

    async respond() {

        const param = JSON.parse(this._post['param']);

        const tableColumn = this._setting.tableColumn;
        const filterSetting = this._setting.filterSetting;

        let result = {};
        if (param && param.hasSetting == 0) {
            result.tableColumn = this._setting.tableColumn;
            result.filterSetting = this._setting.filterSetting;
            result.batchSetting = this._setting.batchSetting;
            result.tableAction = this._setting.tableAction;
            result.formFields = this._setting.formFields;
        }

        const page = lodash.get(param, 'query.page', 1);
        const pageSize = 20;
        const limit = [page, pageSize, 10];

        const formFields = this.tablecolumn2sqlfields(tableColumn);

        const condition = await this.query2condition(param.query, filterSetting);

        const cur_model = new model(this._db, this._controller);

        let { success, results, total } = await cur_model.all(condition, formFields, ' `id` desc ', limit);

        if (!success) {
            results = [];
            total = 0;
        }

        const tableData = await this._hook.emit(this._controller + '_table_get_data', results);

        result.tableData = tableData;
        result.tableTotal = total;
        result.pageSize = pageSize;

        return [1, '获取数据成功', result];

    }
}

export default table;
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}