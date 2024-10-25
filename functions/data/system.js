let currentIndex = 0;

function autoIncrIndex() {
    return `#system${++currentIndex}`;
}

// Main menu structure
const system = {
    path: autoIncrIndex(),
    title: "系统",
    icon: "system-setting",
    // 二级菜单
    children: [{
        path: autoIncrIndex(),
        title: "系统功能",
        icon: "system-marked",
        // 三级菜单
        children: [
            {
                path: "/admin-kv/",
                title: "缓存管理",
                // 四级菜单
                children: [{
                    path: "/admin-kv-table/",
                    title: "列表",
                    type: 'table',
                    api: {
                        table: "../admin/kv/table/",
                        form: "../admin/kv/form/",
                    },
                }, ],
            },
            {
                path: "/admin-attachment/",
                title: "附件管理",
                // 四级菜单
                children: [{
                    path: "/admin-attachment-table/",
                    title: "列表",
                    type: 'table',
                    api: {
                        table: "../admin/attachment/init/?do=table",
                        form: "../admin/attachment/init/?do=form",
                    },
                }, ],
            },
            {
                path: "/admin-manager/",
                title: "用户管理",
                // 四级菜单
                children: [{
                    path: "/admin-manager-table/",
                    title: "列表",
                    type: 'table',
                    api: {
                        table: "../admin/manager/init/?do=table",
                        form: "../admin/manager/init/?do=form",
                    },
                }, ],
            },
            {
                path: "/admin-logs/",
                title: "操作日志",
                // 四级菜单
                children: [{
                    path: "/admin-logs-table/",
                    title: "列表",
                    type: 'table',
                    api: {
                        table: "../admin/logs/init/?do=table",
                        form: "../admin/logs/init/?do=form",
                    },
                }, ],
            },
        ],
    }, ],
};

export default system;
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}