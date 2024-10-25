<template>
    <div class="admin-table">
        <div class="admin-table-content">
            <t-table row-key="id" :hover="true" :columns="tableColumn" :data="tableData" @select-change="selectionOnChange" :table-layout="'fixed'">
                <template #row-operation="{ row }">
                    <t-space size="small">
                        <t-link class="admin-table-operation" theme="primary" hover="color" theme="default" size="small" v-for="(item, index) in tableAction" :key="item.title" @click="actionOnClick(item,row)">{{ item.title }}</t-link>
                    </t-space>
                </template>
            </t-table>
        </div>
        <div class="admin-table-footer">
            <div class="admin-table-pagination">
                <t-pagination v-model.sync="currentPage" size="small" :page-size-options="[]" :total="tableTotal" :page-size="pageSize" show-jumper @current-change="currentOnChange"></t-pagination>
            </div>
            <div class="admin-table-actions">
                <t-button @click="refreshOnClick" shape="circle" variant="outline">
                    <t-icon name="refresh"></t-icon>
                </t-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['currentPage', 'tableTotal', 'pageSize', 'tableData', 'tableColumn', 'tableAction', ],
    components: {},
    computed: {},
    watch: {},
    mounted: function() {},
    data: function() {
        return {}
    },
    methods: {
        refreshOnClick: function() {
            window.location.reload();
        },
        currentOnChange: function(page, pageInfo) {
            // this.currentPage = page;
            this.$emit('pagechange', page);
        },
        actionOnClick: function(item, data) {

            var that = this;
            if (item.action == 'edit') {
                // 添加按钮
                this.$emit('formedit', item.field, data[item.field]);
                return;
            }

            if (item.action == 'ajax') {
                // 必须是明确设置confirm为false，才不弹出提示
                if (item.confirm === false) {
                    this.actionAjax(item, data);
                    return;
                }

                this.$funs.confirmMsg(item.confirm ? item.confirm : '继续操作？', function() {
                    that.actionAjax(item, data);
                });

                return;

            }

            if (item.action == 'goto') {
                // 跳转按钮
                this.actionGoto(item, data);
                return;
            }

            if (item.action == 'link') {
                // 跳转链接
                this.actionLink(item, data);
                return;
            }
        },
        actionAjax: function(item, data) {

            var that = this;

            var param = {
                field: item.field,
                data: data[item.field],
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
                    } else {
                        // 触发表格页面刷新
                        that.$emit('dataupdate');
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
        selectionOnChange: function(value, options) {
            // console.log(value);
            // console.log(more);
            this.$emit('selectionchange', options.selectedRowData);
        },
        actionGoto: function(item, data) {

            var field = item.field;

            var query = {};

            if (Array.isArray(field)) {

                for (var i = 0; i < field.length; i++) {
                    var temp = field[i];
                    query[temp] = data[temp];
                }

            } else {
                query[field] = data[field];
            }

            var path = item.path ? item.path : this.$route.path;

            this.$funs.reparseActiveMenu();
            this.$router.push({ path: path, query });
        },
        actionLink: function(item, data) {

            var field = item.field;
            var url = item.url;

            if (item.field) {

                if (Array.isArray(field)) {

                    for (var i = 0; i < field.length; i++) {
                        var temp = field[i];
                        url = url.replace('{' + temp + '}', data[temp]);
                    }

                } else {
                    url = url.replace('{' + field + '}', data[field]);
                }
            }

            window.open(url);
        }
    },

}
</script>
<style>
/*表格*/
.admin-table {
    padding-bottom: 40px;
}

.admin-table-content {
    border: 1px solid #EBEEF5;
}

.admin-table-content .t-table {
    font-size: 12px;
}

.admin-table-content .t-table .t-table__th-cell-inner {
    font-weight: bold;
}

.admin-table-content .admin-table-operation {
    color: #409eff;
}

.admin-table-footer {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;

    position: absolute;
    bottom: 0;
    background-color: #fff;
    width: calc(100% - 310px);
    z-index: 9;
    border: 1px solid #EBEEF5;
}

.admin-table-actions {
    white-space: nowrap;
}
</style>