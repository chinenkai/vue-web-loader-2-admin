import backend from "../common/backend.js"
import tableColumn from "./setting/tableColumn.js"
import batchSetting from "./setting/batchSetting.js"
import tableAction from "./setting/tableAction.js"
import formFields from "./setting/formFields.js"

class kv extends backend {
    constructor(context, action) {
        super(context, 'kv', action);
        this._setting = {
            tableColumn: tableColumn,
            filterSetting: null,
            batchSetting: batchSetting,
            tableAction: tableAction,
            formFields: formFields,
        }
    }
}
export default kv
export async function onRequest(context) {
    return await new kv(context, 'init').init();
}