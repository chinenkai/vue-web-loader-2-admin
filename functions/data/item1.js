let currentIndex = 0;

function autoIncrIndex() {
    return `#item1${++currentIndex}`;
}

const item1 = {
    path: autoIncrIndex(),
    title: "功能",
    icon: "dashboard",
    // 二级菜单
    children: [{
            path: autoIncrIndex(),
            title: "功能数据",
            icon: "chart-line-data-1",
            // 三级菜单
            children: [{
                path: "/admin-demo/",
                title: "示例数据",
                // 四级菜单
                children: [{
                        path: "/admin-demo-card/",
                        title: "统计",
                        type: 'card',
                        api: {
                            card: "../admin/demo/init/?do=card",
                        },
                    },
                    {
                        path: "/admin-demo-table/",
                        title: "列表",
                        type: 'table',
                        api: {
                            table: "../admin/demo/init/?do=table",
                            form: "../admin/demo/init/?do=form",
                        },
                    },
                    // {
                    //     path: autoIncrIndex(),
                    //     title: "导出",
                    //     type: 'link',
                    //     url: "../admin/demo/export/",
                    // },
                ],
            }, ],
        },
        {
            path: autoIncrIndex(),
            title: "用户管理",
            icon: "user-circle",
            // 三级菜单
            children: [{
                    path: "/admin-user/",
                    title: "用户数据",
                    // 四级菜单
                    children: [{
                            path: "/admin-user-card/",
                            title: "统计",
                            type: 'card',
                            api: {
                                card: "../admin/user/init/?do=card",
                            },
                        },
                        {
                            path: "/admin-user-table/",
                            title: "列表",
                            type: 'table',
                            api: {
                                table: "../admin/user/init/?do=table",
                                form: "../admin/user/init/?do=form",
                            },
                        },
                    ],
                },
                {
                    path: "/admin-errmsg/",
                    title: "错误信息",
                    // 四级菜单
                    children: [{
                        path: "/admin-errmsg-table/",
                        title: "列表",
                        type: 'table',
                        api: {
                            table: "../admin/errmsg/init/?do=table",
                            form: "../admin/errmsg/init/?do=form",
                        },
                    }, ],
                },
                {
                    path: "/admin-config/",
                    title: "应用配置",
                    // 四级菜单
                    children: [{
                        path: "/admin-config-block/",
                        query: {
                            formField: "group",
                            formValue: "system",
                        },
                        title: "表单",
                        type: 'form',
                        api: {
                            form: "../admin/config/block/",
                        },
                    }, ],
                },
            ],
        },
        {
            path: autoIncrIndex(),
            title: "其他链接",
            icon: "link-1",
            // 三级菜单
            children: [{
                path: autoIncrIndex(),
                title: "活动主页",
                type: "link",
                // 四级菜单
                url: "/?from=backend",
            }, ],
        },
    ],
};

// Export the menu structure
export default item1;
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}