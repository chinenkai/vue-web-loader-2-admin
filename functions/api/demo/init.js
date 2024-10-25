import base from "../../core/base.js"
class demo extends base {
    constructor(context, action) {
        super(context, 'demo', action);
    }
}
export default demo
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}