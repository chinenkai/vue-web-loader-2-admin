import { get_zero_time } from "../../../core/utils.js"
export default [{
    title: "今日新增",
    content: [
        "{total}",
        { total: [`\`createtime\` >= ${get_zero_time('today')}`] }
    ],
    desc: [
        "昨日：{yesterday}",
        { yesterday: [`\`createtime\` < ${get_zero_time('today')} and \`createtime\` >= ${get_zero_time('yesterday')}`] }
    ]
}];