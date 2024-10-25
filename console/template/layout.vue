<template>
    <section class="admin-layout">
        <div class="admin-layout-side-split">
            <div class="admin-layout-side-split-top">
                <a href="../?from=admin" target="_blank">
                    <img class="logo" :title="$CONFIG.APP_NAME" src="./assets/logo-r.png">
                </a>
            </div>
            <div class="admin-layout-side-split-scroll">
                <!-- 一级菜单 -->
                <ul>
                    <li v-for="item in menus" :class="curTopMenu.path == item.path ? 'active' : ''" @click="topMenuOnClick(item)">
                        <t-icon :name="item.icon || 'menu-application'" size="large"></t-icon>
                        <p>{{ item.title }}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="topMenus.length > 0" class="admin-layout-side">
            <div class="admin-layout-side-top">
                <h2 v-if="curTopMenu">{{ curTopMenu.title }}</h2>
            </div>
            <div class="admin-layout-side-scroll">
                <!-- 二级菜单 -->
                <t-menu v-model="subActive" width="210px">
                    <template v-for="subMenu in topMenus">
                        <div class="admin-layout-menu-group">
                            <div v-if="subMenu.title" class="admin-layout-menu-group-title">
                                <t-icon v-if="subMenu.icon" :name="subMenu.icon || 'menu-application'" size="large"></t-icon>
                                <span>{{subMenu.title}}</span>
                            </div>
                            <template v-for="terMenu in subMenu.children">
                                <t-menu-item :value="terMenu.path" @click="terMenuOnClick(terMenu)">
                                    <span class="admin-layout-menu-item-title">{{terMenu.title}}</span>
                                </t-menu-item>
                            </template>
                        </div>
                    </template>
                </t-menu>
            </div>
        </div>
        <div class="admin-layout-body">
            <div class="admin-layout-topbar">
                <div class="left-panel">
                    <t-head-menu v-model="fouActive" class="admin-layout-topbar-menu">
                        <template v-for="fouMenu in terMenus.children">
                            <t-menu-item :value="fouMenu.path" @click="fouMenuOnClick(fouMenu)">
                                <span class="admin-layout-menu-item-title">{{fouMenu.title}}</span>
                            </t-menu-item>
                        </template>
                    </t-head-menu>
                </div>
                <div class="right-panel">
                    <div class="admin-layout-topbar-user">
                        <!--
                            注意，tdesign文档里用“popupProps”作为参数名称
                            在Vue-Web-loader2中，必须改为popup-props
                            其他参数同理，去掉中间大写字母，并加上短横线
                        -->
                        <t-dropdown :options="user.menus" @click="userMenuOnClick" trigger="click" :popup-props="{ overlayClassName:'admin-layout-topbar-user-menu-popup' }" :min-column-width="150">
                            <t-button variant="text" class="admin-layout-topbar-user-menu">
                                <span>
                                    <t-icon name="user-circle" size="28"></t-icon>{{ user.userName }} <t-icon name="chevron-down" size="16"></t-icon>
                                </span>
                            </t-button>
                        </t-dropdown>
                    </div>
                </div>
            </div>
            <div class="admin-main" id="admin-main">
                <router-view :key="routerViewKey"></router-view>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    components: {},
    computed: {
        menus: function() {
            return this.$root.$data.state.menus;
        },
        user: function() {
            return this.$root.$data.state.user;
        },
        activeMenuHook: function() {
            return this.$root.$data.state.activeMenuHook;
        },
        routerViewKey: function() {
            // 解决不同路由使用相同组件钩子函数不执行问题
            // https://www.cnblogs.com/XF-eng/p/14722578.html
            if (this.$route.name !== undefined) {
                return this.$route.name + +new Date();
            } else {
                return this.$route + +new Date();
            }
        },
    },
    watch: {
        'activeMenuHook': function(data) {
            // console.log('layout.vue in watch activeMenuHook');
            // 当路由地址发生改变的时候，重新分析菜单
            this.parseActiveMenu(this.menus);
        },
        '$route': function(to, from) {
            // 仅针对从统计页带参数跳转到表格页时，更新四级菜单的状态
            if (from.path.indexOf('-card') > -1 && to.path.indexOf('-table') > -1 && _.size(to.query) > 0) {
                this.fouActive = to.path;
            }
        }
    },
    mounted: function() {

        // 隐藏加载
        if (document.getElementsByClassName('loader-wrapper') && document.getElementsByClassName('loader-wrapper')[0]) {
            document.getElementsByClassName('loader-wrapper')[0].style.display = "none";
        }
        // 初始化菜单
        if (this.menus && this.menus.length > 0) {
            this.parseActiveMenu(this.menus);
        }
    },
    data: function() {
        return {
            curTopMenu: {},
            topMenus: [],
            terMenus: [],
            subActive: '',
            fouActive: '',
            overlayClassName: 'asdfasdfasdf',
        }
    },
    methods: {
        backToDefaultPath: function(query) {
            query = query ? query : {};
            if (Object.keys(this.$route.query).length == 0 || _.isEqual(this.$route.query, query)) {
                window.location.reload();
                return;
            }

            this.$router.push({ path: this.$route.path, query: query });
        },
        setTopActiveMenu: function(menu, path) {
            this.curTopMenu = menu;
            this.topMenus = this.filterUrl(this.curTopMenu.children);
            this.subActive = path;
        },
        parseActiveMenu: function(menus) {

            var that = this;

            this.terMenus = [];

            var routePath = this.$route.path;

            if (routePath == '/') {
                // 访问的是首页
                // 取第一个三级菜单
                var nextMenu = menus[0].children[0].children[0];

                this.setTopActiveMenu(menus[0], nextMenu.path);

                if (nextMenu.children && nextMenu.children.length > 0) {
                    this.terMenus = nextMenu;
                    // 存在下级菜单，使用下一级菜单
                    nextMenu = nextMenu.children[0];
                    this.$nextTick(function() {
                        that.fouActive = nextMenu.path;
                    });
                }
                // 加载子菜单中的第一项
                this.$router.push(nextMenu.path);
                return;
            }

            // 如果访问的是特定页面，逐级遍历菜单，找到对应的路由地址
            // 遍历全部菜单
            for (var i = 0; i < menus.length; i++) {

                var topMenu = menus[i];

                // 遍历每个一级菜单
                for (var j = 0; j < topMenu.children.length; j++) {

                    var subMenu = topMenu.children[j];

                    // 判断2级菜单是否具有子菜单
                    if (!subMenu.children || subMenu.children.length <= 0) {
                        continue;
                    }

                    // 遍历每个二级菜单
                    for (var k = 0; k < subMenu.children.length; k++) {

                        var terMenu = subMenu.children[k];

                        // 检测路由是否对应当前三级菜单
                        if (routePath.indexOf(terMenu.path) == 0) {
                            this.setTopActiveMenu(menus[i], terMenu.path);
                            return;
                        }

                        // 判断三级菜单是否具有子菜单
                        if (!terMenu.children || terMenu.children.length <= 0) {
                            continue;
                        }

                        // 遍历每个三级菜单
                        for (var l = 0; l < terMenu.children.length; l++) {

                            var fouMenu = terMenu.children[l];
                            // 检测是否三级菜单
                            if (routePath.indexOf(fouMenu.path) == 0) {
                                this.setTopActiveMenu(menus[i], terMenu.path);
                                this.terMenus = terMenu;
                                this.$nextTick(function() {
                                    that.fouActive = fouMenu.path;
                                });
                                return;
                            }
                        }
                    }
                }
            }

        },
        terMenuOnClick: function(terMenu) {
            var that = this;

            if (terMenu && terMenu.type == 'link') {
                window.open(terMenu.url);
                // 重新分析菜单活动项
                this.parseActiveMenu(this.menus);
                return false;
            }

            // 判断是否存在子菜单
            if (terMenu.children && terMenu.children.length > 0) {
                this.terMenus = this.$funs.cloneData(terMenu);

                var nextPath = this.terMenus.children[0].path;
                var query = this.terMenus.children[0].query ? this.terMenus.children[0].query : {};

                if (this.$route.path == nextPath) {
                    this.backToDefaultPath(query);
                    return;
                }

                this.$nextTick(function() {
                    that.fouActive = nextPath;
                });

                // 加载子菜单中的第一项
                this.$router.push({ path: nextPath, query: query });
                return;
            }

            // 重复点击菜单
            if (this.$route.path == terMenu.path) {
                this.backToDefaultPath(terMenu.query);
                return;
            }

            // 没有子菜单，清空并尝试直接加载对应路由页面
            this.terMenus = [];
            this.$router.push(terMenu.path);
        },
        fouMenuOnClick: function(fouMenu) {
            var that = this;

            if (fouMenu && fouMenu.type == 'link') {
                window.open(fouMenu.url);
                // 重新分析菜单活动项
                this.parseActiveMenu(this.menus);
                return false;
            }


            // 重复点击菜单
            if (this.$route.path == fouMenu.path) {
                this.backToDefaultPath(fouMenu.query);
                return;
            }

            this.$nextTick(function() {
                that.fouActive = fouMenu.path;
            });

            var query = fouMenu.query ? fouMenu.query : {};

            this.$router.push({ path: fouMenu.path, query: query });
        },
        //点击显示
        topMenuOnClick: function(item) {
            this.curTopMenu = item;
            this.topMenus = this.filterUrl(item.children);
            if ((!item.children || item.children.length == 0) && item.component) {
                this.$router.push({ path: item.path })
            }
        },
        //转换外部链接的路由
        filterUrl: function(map) {

            var that = this;

            var newMap = [];

            if (!map) {
                return newMap;
            }

            map.forEach(function(item) {
                //递归循环
                if (item.children && item.children.length > 0) {
                    item.children = that.filterUrl(item.children);
                }
                newMap.push(item)
            })
            return newMap;
        },
        userMenuOnClick: function(item) {
            if (item.action == 'ajax') {
                // 删除按钮
                this.userMenuAjax(item);
                return;
            }

            if (item.action == 'link') {
                // 跳转链接
                window.open(item.url);
                return;
            }
        },
        userMenuAjax: function(item) {

            var that = this;

            var param = {
                item: item,
            }

            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(item.url, param, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {

                    // 弹出正确信息
                    that.$funs.successMsg(result.msg);

                    // 判断是否需要reload
                    if (result.reload == 1) {
                        setTimeout(function() {
                            window.location.reload();
                        }, 3000);
                    }
                    return;
                }

                // 其他情况都弹出信息
                that.$funs.errorMsg(result.msg);

                // 状态2表示token过期
                if (result.status == 2) {
                    that.$funs.removeTokenAndReload(0);
                    return;
                }

            }, function(err, raw_text) {
                console.log(err);
                that.$funs.errorMsg('数据操作失败');
                that.$funs.errorMsg(raw_text);
            });
        },
    },
}
</script>
<style>
.admin-layout {
    display: flex;
    flex: 1;
    overflow: auto;
    overflow-x: hidden;
}

.admin-layout-body {
    flex: 1;
    display: flex;
    flex-flow: column;
}

.admin-main {
    overflow: auto;
    background-color: #f6f8f9;
    flex: 1;
    padding: 15px;
}


/* 左侧菜单 */
.admin-layout-side-split {
    width: 65px;
    flex-shrink: 0;
    background: #222b45;
    display: flex;
    flex-flow: column;
}

.admin-layout-side-split-top {
    height: 49px;
}

.admin-layout-side-split-top a {
    display: inline-block;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.admin-layout-side-split-top .logo {
    height: 30px;
    vertical-align: bottom;
}

.admin-layout-side-split-scroll {
    overflow: auto;
    overflow-x: hidden;
    height: 100%;
    flex: 1;
}

.admin-layout-side-split li {
    cursor: pointer;
    width: 65px;
    height: 65px;
    color: #fff;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.admin-layout-side-split li i {
    font-size: 18px;
}

.admin-layout-side-split li p {
    margin-top: 5px;
}

.admin-layout-side-split li:hover {
    background: rgba(255, 255, 255, 0.1);
}

.admin-layout-side-split li.active {
    background: #409EFF;
}

.admin-layout-side-split-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 5px;
}

.admin-layout-side-split-scroll::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
}

.admin-layout-side-split-scroll::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0);
}

.admin-layout-side-split-scroll::-webkit-scrollbar-track:hover {
    background-color: rgba(255, 255, 255, 0);
}

.admin-layout-side {
    display: flex;
    flex-flow: column;
    flex-shrink: 0;
    width: 210px;
    background: #fff;
    box-shadow: 2px 0 8px 0 rgba(29, 35, 41, .05);
    border-right: 1px solid #e6e6e6;
    transition: width 0.3s;
}

.admin-layout-side-top {
    border-bottom: 1px solid #ebeef5;
    height: 50px;
    line-height: 50px;
}

.admin-layout-side-top h2 {
    padding: 0 20px;
    font-size: 17px;
    color: #3c4a54;
}


.admin-layout-side-scroll {
    overflow: auto;
    overflow-x: hidden;
    flex: 1;
}

.admin-layout-side-scroll .t-menu.t-menu--scroll {
    padding: 0;
}

.admin-layout-side-scroll .t-menu .admin-layout-menu-group-title,
.admin-layout-side-scroll .t-menu .t-menu__item {
    height: 56px;
    line-height: 56px;
    color: #303133;
    padding-left: 20px;
}

.admin-layout-side-scroll .t-menu .admin-layout-menu-group-title .t-icon {
    vertical-align: sub;
}

.admin-layout-side-scroll .t-menu .t-menu__item {
    padding-left: 45px;
    padding-right: 0px;
    margin-top: 0px;

}

.admin-layout-side-scroll .t-menu .t-is-active .admin-layout-menu-item-title {
    color: #409EFF;
}


.admin-layout-topbar {
    height: 50px;
    border-bottom: 1px solid #ebeef5;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    display: flex;
    justify-content: space-between;
}

.admin-layout-topbar .left-panel {
    display: flex;
    align-items: center;
}

.admin-layout-topbar .right-panel {
    display: flex;
    align-items: center;
}

.admin-layout-topbar .admin-layout-topbar-menu,
.admin-layout-topbar .admin-layout-topbar-menu .t-head-menu__inner {
    height: 50px;
}

.admin-layout-topbar .admin-layout-topbar-menu .t-menu {
    margin-left: 0;
}

.admin-layout-topbar .admin-layout-topbar-menu .t-menu .t-menu__item {
    height: 50px;
    line-height: 50px;
    padding-left: 30px;
    padding-right: 30px;
    color: #909399;
    margin-left: 0;
    border-bottom: 2px solid #FFF;

}

.admin-layout-topbar .admin-layout-topbar-menu .t-menu .t-menu__item:hover,
.admin-layout-topbar .admin-layout-topbar-menu .t-menu .t-menu__item.t-is-active {
    background-color: transparent;
    border-radius: 0;
    border-bottom: 2px solid #409EFF;
    color: #303133;
    transition: none;
}

.admin-layout-topbar-user .admin-layout-topbar-user-menu {
    height: 50px;
    line-height: 50px;
    border-radius: 0;
}
</style>