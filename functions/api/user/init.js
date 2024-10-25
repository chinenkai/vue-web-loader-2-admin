import base from "../../core/base.js"
class user extends base {
    constructor(context, action) {
        super(context, 'user', action);
    }
}
export default user
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}