// token.js
import { common_encrypt, common_decrypt } from './utils.js';

export class token {
    _token = new Map();
    _token_change = false;
    _error_msg = '';
    _app_version = 0;

    constructor(token, app_version) {
        this._token_str = token;
        this._app_version = app_version;
    }

    make() {

        if (!this._token) return '';
        try {
            const token_json = JSON.stringify(Array.from(this._token.entries()));
            const token_str = common_encrypt(token_json, this._app_version);
            return token_str ? token_str : '';
        } catch (error) {
            this._error_msg = `[make_token]${error.message}`;
        }
    }

    parse() {
        if (!this._token_str) return new Map();
        try {
            const decrypted = common_decrypt(this._token_str, this._app_version);
            if (decrypted == false) return new Map();
            return new Map(JSON.parse(decrypted));
        } catch (error) {
            this._error_msg = `[parse_token]${error.message}`;
            return new Map();
        }
    }

    init() {
        if (this._token.size > 0) return true;

        this._token = this.parse();
    }

    set(key, value) {
        this.init();
        this._token.set(key, value);
        this._token_change = true;
    }

    is_change() {
        return this._token_change
    }

    get(key) {
        this.init();
        return this._token.get(key) ? this._token.get(key) : null;
    }
}

export default token
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}