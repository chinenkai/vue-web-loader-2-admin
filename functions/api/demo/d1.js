import demo from "./init.js"
class d1 extends demo {
    constructor(context) {
        super(context, 'd1');
    }

    async query() {
        const db = this._db;
        const stmt = db.prepare('SELECT * FROM manager WHERE id = ?').bind(...[1]);
        const { success, meta, results } = await stmt.all();
        // this.log(success);
        // this.log(meta);
        this.log(results);
    }

    async test_all() {
        let manager_model = this.model('manager');
        // let data = await manager_model.all({
        //     id: 1,
        // })
        let data = await manager_model.all({
            0: 'id > :id and password != :password',
            id: 0,
            password: '',
        })
        this.log(data);
    }

    async test_count() {
        let manager_model = this.model('manager');
        let data = await manager_model.count({
            0: 'id > :id and password != :password',
            id: 0,
            password: '',
        })
        this.log(data);
    }

    async test_one() {
        let manager_model = this.model('manager');
        let data = await manager_model.one({
            id: 1,
        })
        this.log(data);
    }

    async test_create() {
        let manager_model = this.model('manager');
        let data = await manager_model.create({
            username: 'username' + this.time(),
            password: 'password' + this.time(),
        })
        this.log(data);
    }

    async test_update() {
        let manager_model = this.model('manager');
        let data = await manager_model.update({
            username: 'vue-web-loader-2-admin',
        }, {
            password: 'password' + this.time(),
        })
        this.log(data);
    }

    async test_delete() {
        let manager_model = this.model('manager');
        let data = await manager_model.delete({
            0: 'id >= :id',
            id: 2,
        })
        this.log(data);
    }

    async respond() {
        // this.log('query:');
        // await this.query();
        // this.log('test_model:');
        // await this.test_count();
        // await this.test_one();
        // await this.test_create();
        await this.test_update();
        // await this.test_delete();
        return this.send_json(1, '访问成功demo/d1/' + this.time());
    }
}
export async function onRequest(context) {
    return await new d1(context).init();
}