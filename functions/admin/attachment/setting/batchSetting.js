export default [{
    title: "添加",
    icon: "add",
    action: "add",
    field: "id",
},{
    title: "删除",
    icon: "delete",
    action: "ajax",
    field: "id",
    url: '../admin/attachment/init/?do=batch&action=delete',
}, ];