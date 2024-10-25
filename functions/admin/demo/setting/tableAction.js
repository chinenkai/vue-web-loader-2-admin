export default [{
    title: "编辑",
    action: "edit",
    field: "id",
    url: '../admin/demo/init/?do=form',
}, {
    title: "删除",
    action: "ajax",
    field: "id",
    url: '../admin/demo/init/?do=action&action=delete',
}, ];