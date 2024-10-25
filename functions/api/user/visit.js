import user from "./init.js"
class visit extends user {
    constructor(context) {
        super(context, 'visit');
    }

    test_fun(){
        this.log({s:1,s3:2});
    }

    async respond() {
        // console.log(this._db);
        // console.log(this._kv);
        // this.log(this._post);
        // this._token.set('a','b');
        // this.log(this._token.get('a'));
        // this.test_fun();
        // const base_kv = this.kvalue('base');
        this.exit(new Response(null, { status: 405 }));

        return this.send_json(1, '访问成功user/visit/');
    }
}
export async function onRequest(context) {
    return await new visit(context).init();
}