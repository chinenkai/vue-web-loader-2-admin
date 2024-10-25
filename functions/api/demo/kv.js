import demo from "./init.js"
class kv extends demo {
    constructor(context) {
        super(context, 'kv');
    }

    async test_put() {
        let manager_kvalue = this.kvalue('manager');
        let data = await manager_kvalue.put('now_time', this.time())
        data = await manager_kvalue.put('now_time' + this.time(), this.time())
        this.log(data);
    }

    async test_get() {
        let manager_kvalue = this.kvalue('manager');
        let data = await manager_kvalue.get('now_time')
        this.log(data);
    }

    async test_list() {
        let manager_kvalue = this.kvalue('manager');
        let data = await manager_kvalue.list({ prefix: 'now_time', limit: 1 })
        this.log(data);
    }

    async test_delete() {
        let manager_kvalue = this.kvalue('manager');
        let data = await manager_kvalue.delete('now_time');
        this.log(data);
    }

    async respond() {
        // console.log(this._db);
        // console.log(this._kv);
        await this.test_put();
        await this.test_get();
        await this.test_list();
        await this.test_delete();
        return this.send_json(1, '访问成功demo/kv/');
    }
}
export async function onRequest(context) {
    return await new kv(context).init();
}