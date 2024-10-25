import Vue from 'Vue'
import VueRouter from 'VueRouter'

import app from './app.vue'
import login from './login.vue'
import layout from './layout.vue'
import f404 from './404.vue'

import form from './formPage.vue'
import table from './tablePage.vue'
import card from './cardPage.vue'

var defaultPageMap = {
    table: table,
    form: form,
    card: card,
}


// state ====================================================================================================
// state ====================================================================================================
// state ====================================================================================================

var state = {
    menus: [],
    user: {
        userName: '',
        menus: [],
    },
    activeMenuHook: 0,
}

// funs ====================================================================================================
// funs ====================================================================================================
// funs ====================================================================================================


var funs = {
    initVueRouter: function() {
        return new VueRouter({
            // mode: 'history', // 是否使用 history api
            routes: [{
                    path: '/login',
                    component: login,
                    hidden: true
                },
                {
                    path: '/',
                    name: 'layout',
                    component: layout,
                    children: []
                },
                {
                    path: '/404',
                    component: f404,
                    hidden: true
                },
                { path: '*', redirect: '/404', hidden: true },

            ]
        });
    },
    initVue: function(router) {
        // 创建vue实例
        window.VueApp = new Vue({
            // el: '#app',
            data: {
                state: state,
            },
            router: router,
            render: function(h) {
                return h(app);
            }
        });

        window.VueApp.$mount('#app');

        return window.VueApp;
    },
    cloneData: function(data) {
        return JSON.parse(JSON.stringify(data));
    },
    successMsg: function(msg) {
        window.VueApp.$message.success(msg);
    },
    errorMsg: function(msg) {
        window.VueApp.$message.error(msg);
    },
    confirmMsg: function(msg, callback) {
        const confirmDia = VueApp.$dialog.confirm({
            header: '提示',
            body: msg,
            confirmBtn: '确定',
            cancelBtn: '取消',
            onConfirm: function() {
                callback();
                confirmDia.hide();
            },
            onClose: function() {
                confirmDia.hide();
            },
        });
    },
    module: function() {
        // 默认使用当前服务器的静态资源和接口
        var index = location.pathname.lastIndexOf('/');
        var baseUrl = location.origin + location.pathname.substring(0, index + 1);
        // 将地址拆分成数组，
        var arr = baseUrl.split('/');
        // 取倒数第2个，作为模块名称
        return arr[arr.length - 3] + '_' + arr[arr.length - 2];
    },
    cache: function() {

        var cachePrefix = funs.module() + ':';

        // 提供两个参数时，为set
        if (arguments.length >= 2) {
            var key = arguments[0];
            var value = arguments[1];
            return localStorage.setItem(cachePrefix + key, value);
        }

        // 只有一个参数时，为get
        if (arguments.length == 1) {
            var key = arguments[0];
            return localStorage.getItem(cachePrefix + key);
        }

        return null;
    },
    post: function(url, data, success, error) {
        var raw_text = '';
        var token = funs.cache('token');

        // var params = new URLSearchParams();
        var params = new FormData();

        params.append('token', (token ? token : ''));
        params.append('param', JSON.stringify(data));


        fetch(url, {
            method: 'POST',
            // 使用FormData数据格式，就不允许设置Content-type，交给浏览器自行处理
            // 使用URLSearchParams数据格式，就必须设置Content-type为下面的值
            // headers: {
            //     "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            // },
            body: params,
        }).then(function(response) {
            return response.text();
        }).then(function(text) {
            raw_text = text;
            var json = JSON.parse(text);
            // 自动更新token
            if (json.token) {
                funs.cache('token', json.token);
            }
            if (json.reload) {
                setTimeout(function() {
                    window.location.reload();
                }, 1200);
            }
            // 执行回调函数
            if (typeof(success) == 'function') {
                success(json);
            }
        }).catch(function(err) {
            if (typeof(error) == 'function') {
                error(err, raw_text);
            }
        });

    },
    removeTokenAndReload: function(time) {
        funs.cache('token', '');
        // 留出2秒给用户查看信息
        setTimeout(function() {
            window.location.reload();
        }, time);
    },
    initMenusAndUser: function(apiUrl, pageMap, router, callback) {
        // 通过api获取菜单数据
        funs.post(apiUrl, {}, function(result) {

            // 状态1表示调用接口成功
            if (result.status == 1) {
                // 获取菜单成功
                funs.setMenus(pageMap, router, result.menus);
                funs.setUser(result.user);

                // 设置后台网页标题
                if (result.title) {
                    window.document.title = result.title + ' - ' + window.document.title;
                }

                if (typeof(callback) == 'function') {
                    callback(result);
                }

                return;
            }

            // 状态2表示token过期
            if (result.status == 2) {
                funs.removeTokenAndReload(0);
                return;
            }

            // 其他情况都弹出信息
            alert(result.msg);

        }, function(err) {
            console.log(err);
            alert('获取菜单失败');
        });
    },
    reparseActiveMenu: function() {
        state.activeMenuHook = state.activeMenuHook + 1;
    },
    setUser: function(user) {
        state.user = user;
    },
    setMenus: function(map, router, menus) {

        if (!menus) {
            console.log('store.js: menu is empty');
            return;
        }

        var pageMap = Object.assign(map, defaultPageMap);

        // 遍历菜单，将三、四级的菜单加入到路由表中
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

                    // 深度克隆避免影响后续菜单展示
                    var terMenu = JSON.parse(JSON.stringify(subMenu.children[k]));

                    // 判断三级菜单是否具有子菜单
                    if (!terMenu.children || terMenu.children.length <= 0) {

                        // 不具有子菜单时，直接添加

                        var type = terMenu.type;

                        if (terMenu.children) {
                            delete terMenu.children;
                        }

                        if (!pageMap[type]) {
                            continue;
                        }

                        var temp_path = terMenu.path + '*';

                        router.addRoute('layout', { path: temp_path, meta: terMenu, component: pageMap[type] });
                        continue;
                    }

                    // 遍历每个三级菜单
                    for (var l = 0; l < terMenu.children.length; l++) {
                        // 将四级菜单加入到路由

                        // 深度克隆避免影响后续菜单展示
                        var fouMenu = JSON.parse(JSON.stringify(terMenu.children[l]));

                        var type = fouMenu.type;

                        if (fouMenu.children) {
                            delete fouMenu.children;
                        }

                        if (!pageMap[type]) {
                            continue;
                        }
                        var temp_path = fouMenu.path + '*';

                        router.addRoute('layout', { path: temp_path, meta: fouMenu, component: pageMap[type] });
                    }
                }
            }
        }

        state.menus = menus;
    },
}

// store ====================================================================================================
// store ====================================================================================================
// store ====================================================================================================

// 将配置和常用函数挂载到Vue上
Vue.prototype.$funs = funs;

// 全局拦截Vue错误
Vue.config.errorHandler = function(err, vm, info) {
    // 计算是哪个vue文件出错
    console.error('Vue file >>>', vm.$vnode.tag.substr(vm.$vnode.tag.lastIndexOf('-') + 1).replace('_', '/') + '.vue');
    console.error('Vue info >>>', info);
    console.error('Vue err >>>', err);
    console.error('Vue vm >>>', vm);
}

var store = {
    state: state,
    funs: funs
};

export default store;