import backend from "../common/backend.js"
// import xxxFields from "./setting/xxxFields.js"
import systemFields from "./setting/systemFields.js"

class config extends backend {
    constructor(context, action) {
        super(context, 'config', action);
        this._setting = {
            // xxxFields: xxxFields,
            systemFields: systemFields,
        }
    }
}
export default config
export async function onRequest(context) {
    return await new config(context, 'init').init();
}