/*
代码由claude.ai生成：
    用JavaScript实现一个hook模块，并给出调用这个模块的示例
    改成支持esm的版本
    前面esm版本的hook代码，改成跨文件共享hook的机制
*/
// hook.js
class hook {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        this.listeners.set(event, callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.delete(event);
        }
    }

    async emit(event, args) {
        if (this.listeners.has(event)) {
            const callback = this.listeners.get(event);
            return await callback(args);
        }
        return args;
    }
}

export default hook;
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}