class kvalue {
    constructor(kv, table_name) {
        this._kv = kv;
        this._table_name = table_name;
        this._name_divider = table_name ? '_' : '';
    }

    get_table() {
        return this._table_name;
    }

    async put(key, value, obj) {
        obj = obj ? obj : {};
        return await this._kv.put(this._table_name + this._name_divider + key, value, obj);
    }

    async get(key, obj) {
        obj = obj ? obj : {};
        return await this._kv.get(this._table_name + this._name_divider + key, obj);
    }

    async getWithMetadata(key) {
        return await this._kv.getWithMetadata(this._table_name + this._name_divider + key);
    }

    async list(obj) {

        let param = {
            prefix: this._table_name + this._name_divider + (obj && obj.prefix ? obj.prefix : ''),
            limit: (obj && obj.limit ? obj.limit : 1000),
            cursor: (obj && obj.cursor ? obj.cursor : ''),
        }

        return await this._kv.list(param);
    }

    async delete(key) {
        return await this._kv.delete(this._table_name + this._name_divider + key);
    }
}
export default kvalue
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}