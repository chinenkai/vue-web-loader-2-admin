class demo {
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

    async respond() {

    }
}

export default demo;
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}