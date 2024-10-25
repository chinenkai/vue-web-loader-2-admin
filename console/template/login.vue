<template>
    <div class="admin-login-bg">
        <div class="admin-login-adv">
            <div class="admin-login-adv-title">
                <h2>{{ $CONFIG.app_name }}</h2>
                <h4>{{ $CONFIG.slogan }}</h4>
                <p>{{ $CONFIG.descriptions }}</p>
            </div>
            <div class="admin-login-adv-mask"></div>
            <div class="admin-login-adv-bottom">
                © {{$CONFIG.app_name}} {{$CONFIG.app_ver}}
            </div>
        </div>
        <div class="login_main">
            <div class="admin-login-form">
                <div class="admin-login-header">
                    <div class="logo">
                        <img :alt="$CONFIG.app_name" src="./assets/logo.png">
                        <label>{{$CONFIG.app_name}}</label>
                    </div>
                </div>
                <t-tabs v-model="tabsValue">
                    <!-- 默认插槽 和 具名插槽（panel）都是用来渲染面板内容 -->
                    <t-tab-panel value="first" label="账号登录" :destroyOnHide="false">
                        <t-form :data="formData" ref="loginForm" :rules="rules" @submit="submitOnClick" :colon="true" :labelWidth="0">
                            <t-form-item name="username">
                                <t-input clearable v-model="formData.username" placeholder="请输入账户名">
                                    <t-icon name="user-unknown" slot="prefix-icon" />
                                </t-input>
                            </t-form-item>
                            <t-form-item name="password">
                                <t-input type="password" clearable v-model="formData.password" placeholder="请输入密码">
                                    <t-icon name="user-password" slot="prefix-icon" />
                                </t-input>
                            </t-form-item>
                            <t-form-item>
                                <t-button theme="primary" type="submit" size="large" block>登录</t-button>
                            </t-form-item>
                        </t-form>
                    </t-tab-panel>
                </t-tabs>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            tabsValue: 'first',
            formData: {
                username: "vue-web-loader-2-admin",
                password: "vue-web-loader-2-admin",
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', type: 'error', trigger: 'blur', },
                ],
                password: [
                    { required: true, message: '请输入密码', type: 'error' },
                ],
            },
        }
    },
    created: function() {},
    mounted: function() {

        // 隐藏加载
        if (document.getElementsByClassName('loader-wrapper') && document.getElementsByClassName('loader-wrapper')[0]) {
            document.getElementsByClassName('loader-wrapper')[0].style.display = "none";
        }
    },
    methods: {
        submitOnClick: function(re) {
            var that = this;

            if (re.validateResult !== true) {
                console.log(re);
                that.$funs.errorMsg(re.firstError);
                return;
            }

            // 通过api获取菜单数据
            that.$funs.post(that.$CONFIG.api.login, that.formData, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {
                    // 登录成功，直接回到首页
                    window.location.href = window.location.href.split('#')[0];
                    return;
                }

                // 其他情况都弹出信息
                that.$funs.errorMsg(result.msg);

            }, function(err, raw_text) {
                console.log(err);
                that.$funs.errorMsg('登录失败');
                that.$funs.errorMsg(raw_text);
            });
        },
    }
}
</script>
<style>
.admin-login-bg {
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
}

.admin-login-adv {
    width: 33.33333%;
    background-color: #555;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;
    background-image: url(./assets/auth_banner.jpg);
}

.admin-login-adv-title {
    color: #fff;
    padding: 40px;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 2;
}

.admin-login-adv-title h2 {
    font-size: 40px;
}

.admin-login-adv-title h4 {
    font-size: 18px;
    margin-top: 10px;
    font-weight: normal;
}

.admin-login-adv-title p {
    font-size: 14px;
    margin-top: 10px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.6);
}

.admin-login-adv-title div {
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.admin-login-adv-title div span {
    margin-right: 15px;
}

.admin-login-adv-title div i {
    font-size: 40px;
}

.admin-login-adv-title div i.add {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.6);
}

.admin-login-adv-bottom {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    color: #fff;
    padding: 40px;
    background-image: linear-gradient(transparent, #000);
    z-index: 3;
}

.admin-login-adv-mask {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.login_main {
    flex: 1;
    overflow: auto;
    display: flex;
}

.admin-login-form {
    width: 400px;
    margin: auto;
    padding: 20px 0;
    padding-bottom: 200px;
}

.admin-login-form .t-form {
    margin-top: 24px;
}

.admin-login-header {
    margin-bottom: 40px;
}

.admin-login-header .logo {
    display: flex;
    align-items: center;
}

.admin-login-header .logo img {
    width: 40px;
    height: 40px;
    vertical-align: bottom;
    margin-right: 10px;
}

.admin-login-header .logo label {
    font-size: 26px;
    font-weight: bold;
}

@media (max-width: 1200px) {
    .admin-login-form {
        width: 340px;
    }
}

@media (max-width: 1000px) {
    .login_main {
        display: block;
    }

    .admin-login-form {
        width: 100%;
        padding: 20px 40px;
    }

    .admin-login-adv {
        display: none;
    }
}
</style>