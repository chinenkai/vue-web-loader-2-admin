import backend from "../common/backend.js"
import tableColumn from "./setting/tableColumn.js"
import batchSetting from "./setting/batchSetting.js"
import tableAction from "./setting/tableAction.js"
import formFields from "./setting/formFields.js"

class logs extends backend {
    constructor(context, action) {
        super(context, 'logs', action);
        this._setting = {
            tableColumn: tableColumn,
            batchSetting: batchSetting,
            tableAction: tableAction,
            formFields: formFields,
        }
    }
}
export default logs
export async function onRequest(context) {
    return await new logs(context, 'init').init();
}