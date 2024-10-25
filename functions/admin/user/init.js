import backend from "../common/backend.js"
import tableColumn from "./setting/tableColumn.js"
import filterSetting from "./setting/filterSetting.js"
import batchSetting from "./setting/batchSetting.js"
import tableAction from "./setting/tableAction.js"
import formFields from "./setting/formFields.js"
import countSetting from "./setting/countSetting.js"
import lineSetting from "./setting/lineSetting.js"

class user extends backend {
    constructor(context, action) {
        super(context, 'user', action);
        this._setting = {
            tableColumn: tableColumn,
            filterSetting: filterSetting,
            batchSetting: batchSetting,
            tableAction: tableAction,
            formFields: formFields,
            countSetting: countSetting,
            lineSetting: lineSetting,
        }
    }
}
export default user
export async function onRequest(context) {
    return await new user(context, 'init').init();
}