export default [{
    title: "编辑",
    action: "edit",
    field: "id",
    url: '../admin/manager/init/?do=form',
}, {
    title: "删除",
    action: "ajax",
    field: "id",
    url: '../admin/manager/init/?do=action&action=delete',
}, ];