import CryptoJS from "../../libs/crypto-js.js"
import lodash from "../../libs/lodash.js"
import dayjs from "../../libs/day.js"
import demo from "./init.js"
class test extends demo {
    constructor(context) {
        super(context, 'test');
    }

    create_password(password) {
        const factor = Math.random().toString(36).slice(-8);
        password = CryptoJS.SHA256(CryptoJS.SHA256(password).toString() + factor).toString()
        return {
            factor: factor,
            password: password
        }
    }

    async respond() {
        // this.log(this._db);
        // this.log(this._kv);
        // this.log(this._post);
        return this.send_json(1, '访问成功demo/test/');
    }
}
export async function onRequest(context) {
    return await new test(context).init();
}