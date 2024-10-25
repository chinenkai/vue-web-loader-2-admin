import lodash from "../libs/lodash.js"
import CryptoJS from "../libs/crypto-js.js"
import dayjs from "../libs/day.js"

export function get_zero_time(type) {

    const now = dayjs();

    switch (type) {
        case 'today':
            return now.startOf('day').unix();
        case 'tomorrow':
            return now.add(1, 'day').startOf('day').unix();
        case 'yesterday':
            return now.subtract(1, 'day').startOf('day').unix();
        case 'last7day':
            return now.subtract(7, 'day').startOf('day').unix();
        case 'lastmonth':
            return now.subtract(1, 'month').startOf('day').unix();
        case 'nextmonth':
            return now.add(1, 'month').startOf('day').unix();
        case 'lastyear':
            return now.subtract(1, 'year').startOf('day').unix();
        case 'week':
            return now.startOf('week').unix();
        case 'month':
            return now.startOf('month').unix();
        case 'year':
            return now.startOf('year').unix();
        default:
            return now.unix();
    }

}

// URL 安全的 Base64 编码
function urlSafeBase64Encode(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// URL 安全的 Base64 解码
function urlSafeBase64Decode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return atob(str);
}

export function common_decrypt(str, version) {

    // base64解码
    str = urlSafeBase64Decode(str);

    // AES解密
    var decrypted = CryptoJS.DES.decrypt(str, "ansldkfalskdfhqo4w;rn;lqkwf09f3n2lksn_cf_pages_functions_" + version);

    // 返回数据
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export function common_encrypt(str, version) {

    // AES加密
    var encrypted = CryptoJS.DES.encrypt(str, "ansldkfalskdfhqo4w;rn;lqkwf09f3n2lksn_cf_pages_functions_" + version);

    // base64加密
    str = urlSafeBase64Encode(encrypted.toString());

    // 返回数据
    return str;
}

// 作者：SugarTurboS
// 链接：https://juejin.cn/post/6844903735416586248
export function get_caller_file_name_and_line() {
    function getException() {
        try {
            throw Error('');
        } catch (err) {
            return err;
        }
    }

    const err = getException();

    const stack = err.stack;
    const stackArr = stack.split('\n');

    // let callerStackLine = '';
    for (let i = 0; i < stackArr.length; i++) {
        // 先找到当前函数get_caller_file_name_and_line所在行，再往下找.log函数，最后判断是不是超出了
        if (stackArr[i].indexOf('get_caller_file_name_and_line') > 0 && stackArr[i + 1].indexOf('.log') > 0 && i + 2 < stackArr.length) {
            // 只有返回数组时wrangler 命令行才会自动把压缩后的文件地址替换成实际地址
            return stackArr[i + 2].split('\n');
        }
    }
    return [];
}
export function time() {
    return parseInt((new Date().getTime() / 1000).toFixed(0));
}
export function is_json(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}