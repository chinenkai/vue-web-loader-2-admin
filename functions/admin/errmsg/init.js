import backend from "../common/backend.js"
import tableColumn from "./setting/tableColumn.js"
import filterSetting from "./setting/filterSetting.js"
import batchSetting from "./setting/batchSetting.js"
import tableAction from "./setting/tableAction.js"
import formFields from "./setting/formFields.js"

class errmsg extends backend {
    constructor(context, action) {
        super(context, 'errmsg', action);
        this._setting = {
            tableColumn: tableColumn,
            filterSetting: filterSetting,
            batchSetting: batchSetting,
            tableAction: tableAction,
            formFields: formFields,
        }
    }
}
export default errmsg
export async function onRequest(context) {
    return await new errmsg(context, 'init').init();
}