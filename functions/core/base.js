import lodash from "../libs/lodash.js"
import { ResponseExit, exit } from "./exit.js"
import { time, is_json, get_caller_file_name_and_line } from './utils.js';
import hook from "./hook.js"
import token from "./token.js"
import model from "./model.js"
import kvalue from "./kvalue.js"
const _model_maps = {};
const _kvalue_maps = {};
class base {
    constructor(context, controller, action) {
        this._ctx = context;
        this._controller = controller;
        this._action = action;
    }

    async init() {
        this._db = this._ctx.env.DB;
        this._kv = this._ctx.env.KV;
        this._bu = this._ctx.env.BUCKET;

        this._get = this._parse_get(this._ctx);
        this._post = await this._parse_post(this._ctx);
        this._headers = this._parse_headers(this._ctx);

        // 实例化token
        this._token = new token(this._post['token'], await this.init_app_version());

        // 实例化hook
        this._hook = new hook();
        // 然后执行bind_hook
        // 方便子类覆盖这个方法添加自己的hook
        this.bind_hook();

        try {
            return await this.respond();
        } catch (error) {
            console.log(error);
            if (error instanceof ResponseExit) {
                return error.response;
            }
            return new Response(error.message, { status: 500 });
        }
    }

    bind_hook() {}

    async init_app_version() {

        // 每次系统重置，都重新生成一个app_version
        const base_kv = this.kvalue('base');

        let init_time = await base_kv.get('init_time');

        if (!init_time) {

            init_time = this.time();

            base_kv.put('init_time', init_time);
        }

        return init_time;
    }

    _parse_headers(context) {

        // Claude “写一段Javascript 代码，将请求中的headers数据放到一个对象中，需要在cloudflare page functions 中运行。”
        // 创建一个对象来存储 headers
        const headers = {};

        // 遍历请求头并将它们添加到 headers 对象中
        for (const [key, value] of context.request.headers.entries()) {
            headers[key] = value;
        }

        return headers;
    }

    _parse_get(context) {

        let params = {};

        // Claude “写一段Javascript代码，用来分析网页地址中get请求的参数”

        // 使用 URL 对象解析 URL
        const parsedURL = new URL(context.request.url);

        // 获取查询字符串并遍历所有参数
        for (const [key, value] of parsedURL.searchParams) {
            if (params[key]) {
                if (!Array.isArray(params[key])) {
                    params[key] = [params[key]];
                }
                params[key].push(value);
            } else {
                params[key] = value;
            }
        }

        return params;
    }

    async _parse_post(context) {

        let postData = {};

        if (context.request.method !== "POST") {
            return postData;
        }

        // Claude 写一段Javascript 代码，用来分析post请求的参数，需要在cloudflare page functions 中运行。

        const contentType = context.request.headers.get("content-type");

        try {
            if (contentType && contentType.includes("application/json")) {
                // 处理 JSON 数据
                postData = await context.request.json();
            } else if (contentType && contentType.includes("application/x-www-form-urlencoded")) {
                // 处理 URL 编码的表单数据
                this._formData = await context.request.formData();
                postData = Object.fromEntries(this._formData);
            } else if (contentType && contentType.includes("multipart/form-data")) {
                // 处理 multipart form-data
                this._formData = await context.request.formData();
                postData = {};
                for (const [key, value] of this._formData.entries()) {
                    if (postData[key]) {
                        if (!Array.isArray(postData[key])) {
                            postData[key] = [postData[key]];
                        }
                        postData[key].push(value);
                    } else {
                        postData[key] = value;
                    }
                }
            } else {
                // 其他类型的请求体
                postData = { rawBody: await context.request.text() };
            }

        } catch (error) {
            this.log(error);
            return postData;
        }

        return postData;
    }

    _get_ip() {
        let ip = this._ctx.request.headers.get('cf-connecting-ip');
        if (ip) {
            return ip;
        }
        ip = this._ctx.request.headers.get('x-real-ip');
        if (ip) {
            return ip;
        }
        return '';
    }

    model(table_name) {
        if (!_model_maps[table_name]) {
            _model_maps[table_name] = new model(this._db, table_name);
        }

        return _model_maps[table_name];
    }

    kvalue(table_name) {
        if (!_kvalue_maps[table_name]) {
            _kvalue_maps[table_name] = new kvalue(this._kv, table_name);
        }

        return _kvalue_maps[table_name];
    }

    async savefile(field) {

        // 获取上传的文件
        const file = this._formData.get(field);

        if (!file) {
            return {
                status: 0,
                msg: '未找到' + field + '文件',
            };
        }

        // 生成唯一的文件名
        const file_name = time() + '-' + lodash.random(1000, 9999) + '-' + file.name;

        try {
            // 将文件上传到 R2
            await this._bu.put(file_name, file.stream(), {
                httpMetadata: file.httpMetadata,
                contentType: file.type,
            });

            return {
                status: 1,
                msg: '保存成功',
                url: this._ctx.env.R2_BUCKET_DOMAIN + file_name, // 生成文件的公共 URL
            }
        } catch (error) {
            return {
                status: 0,
                msg: '上传到R2失败',
            };
        }
    }

    time() {
        return time();
    }

    log(info) {
        console.log('file:');
        console.log(get_caller_file_name_and_line());
        console.log('info:');
        console.log(info);
    }

    async logs_error(msg) {}

    exit(response) {
        return exit(response);
    }

    exit_text(text) {
        return exit(this.send_text(text));
    }

    exit_json(status, msg, data = {}) {
        return exit(this.send_json(status, msg, data));
    }

    send_text(text) {
        return Response(text);
    }

    send_json(status, msg, data = {}) {
        let resp = {
            status: status,
            msg: msg,
        };

        if (Array.isArray(data) || typeof data === 'object') {
            Object.assign(resp, data);
        } else {
            resp.data = data;
        }

        if (this._token.is_change() === true) {
            resp.token = this._token.make();
            // this.log(resp.token);
        }

        // 返回0的时候，记录信息到日志里
        if (status === 0) {
            // 第三个参数如果有提供，则记录第三个参数，反之记录第二个参数
            this.logs_error(typeof data === 'string' && data !== '' ? data : msg);
        }
        return Response.json(resp);
    }
}
export default base
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}