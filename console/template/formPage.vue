<template>
    <div class="admin-form-page">
        <t-card :shadow="false" header="编辑">
            <ext-form type="card" :form-field="formField" :form-value="formValue" :form-data="formData" :form-fields="formFields"></ext-form>
        </t-card>
    </div>
</template>
<script>
import form from './form.vue'
export default {
    components: {
        'ext-form': form,
    },
    mounted: function() {
        // 更新配置和数据
        this.getSettingAndData();
    },
    data: function() {
        return {
            formData: {},
            formFields: [],
            formField: "",
            formValue: "",
        }
    },
    methods: {
        getSettingAndData: function() {

            var that = this;

            if (!this.$route.meta['api'] || !this.$route.meta['api']['form']) {
                this.$funs.errorMsg('当前菜单未提供表单配置数据接口');
                return;
            }

            if (this.$route.query['formField']) {
                this.formField = this.$route.query['formField'];
            }

            if (this.$route.query['formValue']) {
                this.formValue = this.$route.query['formValue'];
            }

            var param = {
                'hasSetting': 0,
                'formAction': 'get',
                'formField': this.formField,
                'formValue': this.formValue,
            }

            // 判断是否已经有表单配置缓存
            if (this.$route.meta.setting && this.$route.meta.setting['formFields']) {
                param['hasSetting'] = 1;
            }

            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(this.$route.meta['api']['form'], param, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {

                    if (param['hasSetting'] == 0) {
                        if (!that.$route.meta['setting']) {
                            that.$route.meta['setting'] = {};
                        }
                        // 表单字段
                        that.formFields = that.$route.meta['setting']['formFields'] = result.formFields;
                    } else {
                        // 从菜单里读取配置，放到这里主要是为了避免渲染checkbox出错
                        that.formFields = that.$route.meta.setting['formFields'];
                    }

                    // 表单数据
                    that.formData = result.formData;
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
                that.$funs.errorMsg('获取表单数据失败败');
                that.$funs.errorMsg(raw_text);
            });
        },
    },
    // beforeRouteEnter(to, from, next) {
    //     // 在渲染该组件的对应路由被 confirm 前调用
    //     // 不！能！获取组件实例 `this`
    //     // 因为当守卫执行前，组件实例还没被创建
    //     console.log(to);
    //     console.log(from);
    //     next();
    // },
}
</script>
<style></style>