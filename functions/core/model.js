import { exit } from "./exit.js"
class model {
    constructor(db, table_name) {
        this._db = db;
        this._table_name = table_name;
    }

    get_table() {
        return this._table_name;
    }

    _check_empty(method, name, obj) {
        if (!obj || Object.keys(obj).length == 0) {
            throw new Error('model ' + method + ' [' + name + '] can not be empty');
        }
    }

    async _check_data_type(data) {

        const { results } = await this._db.prepare(`PRAGMA table_info('${this._table_name}')`).all();

        for (var i = 0; i < results.length; i++) {
            let type = results[i].type;
            let name = results[i].name;
            let notnull = results[i].notnull;

            if (type == 'INTEGER' && typeof data[name] === 'string') {
                data[name] = parseInt(data[name]);
            }

            if (type == 'REAL' && typeof data[name] === 'string') {

                data[name] = parseFloat(data[name]);
            }
        }

        return data;
    }

    _parse_conditions(conditions) {

        let sql = '';
        let arr = [];

        // 分两种状况进行处理

        // 第一种，有提供sql语句
        if (conditions[0] && conditions[0] != '') {

            // 保存sql，删除对象内的sql
            sql = conditions[0];
            delete conditions[0];

            // 遍历对象，替换sql所需的参数
            for (let key in conditions) {
                // 如果在sql中找到$key，则将key的值转义后替换进去
                if (sql.indexOf(':' + key) !== -1) {
                    sql = sql.replaceAll(':' + key, ' ? ');
                    arr.push(conditions[key]);
                }
            }

            return { sql, arr };
        }

        // 第二种，没有提供sql语句
        for (let key in conditions) {

            sql = sql + (sql ? ' AND `' : '`') + key + '` = ? ';
            arr.push(conditions[key]);

        }

        return { sql, arr };
    }

    // 生成数字数组
    range(start, end) {
        return new Array(end - start).fill(start).map((el, i) => start + i);
    }

    // 生成分页数据
    pager(page, pageSize, scope, total) {

        pageSize = pageSize ? pageSize : 20;

        scope = scope ? scope : 20;

        if (total <= pageSize) {
            return null;
        }

        let total_page = Math.ceil(total / pageSize);

        page = Math.min(parseInt(Math.max(page, 1)), total_page);

        let result = {
            total_count: total,
            page_size: pageSize,
            total_page: total_page,
            first_page: 1,
            prev_page: ((1 == page) ? 1 : (page - 1)),
            next_page: ((page == total_page) ? total_page : (page + 1)),
            last_page: total_page,
            current_page: page,
            all_pages: [],
            offset: (page - 1) * pageSize,
            limit: pageSize,
        };

        scope = parseInt(scope);

        if (total_page <= scope) {
            result['all_pages'] = this.range(1, total_page);
        } else if (page <= scope / 2) {
            result['all_pages'] = this.range(1, scope);
        } else if (page <= total_page - scope / 2) {
            let right = page + parseInt(scope / 2);
            result['all_pages'] = this.range(right - scope + 1, right);
        } else {
            result['all_pages'] = this.range(total_page - scope + 1, total_page);
        }

        return result;
    }

    // 查找多条数据
    async all(conditions, fields, sort, limit) {
        let total = 0;

        this._check_empty('all', 'conditions', conditions);

        let { sql, arr } = this._parse_conditions(conditions);

        fields = fields ? fields : '*';

        sort = sort ? ' ORDER BY ' + sort : '';

        sql = ' FROM ' + this._table_name + ' WHERE ' + sql;

        // 如果提供的limit参数是数组
        if (Array.isArray(limit) && limit.length == 3) {

            // 先查询总数
            const { results } = await this._db.prepare('SELECT COUNT(*) as M_COUNTER ' + sql).bind(...arr).all();

            total = (results && results[0]) ? results[0]['M_COUNTER'] : 0;

            limit = this.pager(limit[0], limit[1], limit[2], total);

            limit = limit ? ' LIMIT ' + limit['offset'] + ',' + limit['limit'] : '';
        } else {
            limit = limit ? ' LIMIT ' + limit : '';
        }

        sql = 'SELECT ' + fields + sql + sort + limit;



        let rows = await this._db.prepare(sql).bind(...arr).run();

        rows.total = total;

        return rows;
    }

    // 获取一条数据
    async one(conditions, fields, sort) {

        this._check_empty('one', 'conditions', conditions);

        let rows = await this.all(conditions, fields, sort, 1);

        return (rows && rows.success == true && rows.results.length > 0) ? rows.results[0] : false;
    }

    async count(conditions) {

        this._check_empty('count', 'conditions', conditions);

        let { sql, arr } = this._parse_conditions(conditions);

        sql = 'SELECT COUNT(*) as M_COUNTER FROM ' + this._table_name + ' WHERE ' + sql;

        const { results } = await this._db.prepare(sql).bind(...arr).all();

        return (results && results[0]) ? results[0]['M_COUNTER'] : 0;
    }

    async create(row, type) {


        this._check_empty('create', 'row', row);

        row = await this._check_data_type(row);


        let sql = '';

        switch (type) {
            case 1:
                // 正常插入，不判断唯一索引
                sql = "INSERT INTO ";
                break;
            case 2:
                // 插入时，如果遇到唯一索引字段，则替换已有数据
                sql = "INSERT OR REPLACE INTO ";
                break;
            case 3:
                // 插入时，如果遇到唯一索引字段，则忽略当前插入
                sql = "INSERT OR IGNORE INTO ";
                break;
            default:
                // 正常插入，不判断唯一索引
                sql = "INSERT INTO ";
        }

        let fields = [],
            replaces = [],
            values = [];

        for (let key in row) {

            fields.push(key);
            replaces.push('?');
            values.push(row[key]);
        }

        let re = await this._db.prepare(sql + ' ' + this._table_name + ' (`' + fields.join('`,`') + '`) VALUES (' + replaces.join(',') + ')').bind(...values).run();

        return re;
    }

    async update(conditions, row) {

        this._check_empty('update', 'conditions', conditions);
        this._check_empty('update', 'row', row);

        row = await this._check_data_type(row);

        let fields = [],
            values = [];

        for (let key in row) {
            fields.push('`' + key + '` = ?');
            values.push(row[key]);
        }

        let { sql, arr } = this._parse_conditions(conditions);

        return await this._db.prepare(' UPDATE ' + ' ' + this._table_name + ' SET ' + fields.join(',') + ' WHERE ' + sql).bind(...[...values, ...arr]).run();
    }

    async delete(conditions) {

        this._check_empty('delete', 'conditions', conditions);

        let { sql, arr } = this._parse_conditions(conditions);

        return await this._db.prepare('DELETE FROM ' + this._table_name + ' WHERE ' + sql).bind(...arr).run();
    }
}
export default model
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}