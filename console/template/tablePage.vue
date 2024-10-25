<template>
    <div class="admin-table-page">
        <t-card :shadow="false" style="height: auto;margin-bottom: 20px;" v-if="filterSetting && filterSetting.length > 0">
            <div v-for="(item,index) in filterSetting" :key="item.field" class="admin-table-page-select-filter-item">
                <t-space>
                    <label class="admin-table-page-select-filter-item-label">{{item.title}}：</label>
                    <t-check-tag-group v-model="filterSelected[item.field]" :options="item.options" :checked-props="{variant:'light-outline',size:'medium', shape:'round'}" :unchecked-props="{theme: 'default',variant: 'outline', size:'medium', shape:'round'}" :multiple="item.multiple?true:false" @change="filterOnChange(item)"></t-check-tag-group>
                </t-space>
            </div>
        </t-card>
        <t-card :shadow="false" class="admin-table-page-table-panel">
            <t-row>
                <t-col flex="none">
                    <t-space>
                        <t-button v-for="(item,index) in batchSetting" :shape="item.shape?item.shape:'square'" :theme="item.theme?item.theme:'primary'" :variant="item.variant?item.variant:'base'" @click="batchOnClick(item)" :title="item.title">
                            <t-icon :name="item.icon"></t-icon>
                        </t-button>
                    </t-space>
                </t-col>
                <t-col flex="auto" class="admin-table-page-table-panel-right" v-if="searchSetting && searchSetting.length > 0">
                    <t-space size="small">
                        <t-date-range-picker v-model="searchDate" enable-time-picker allow-input clearable @change="dateOnChange"></t-date-range-picker>
                        <t-select v-model="searchField" :style="{ width: '100px' }">
                            <t-option v-for="(item,index) in searchSetting" :label="item.label" :value="item.value"></t-option>
                        </t-select>
                        <t-select v-model="searchComparator" :style="{ width: '60px' }" placeholder="">
                            <t-option v-for="(item,index) in comparatorOptions" :value="item.value" :label="item.label" :key="item.value">{{item.label}}</t-option>
                        </t-select>
                        <t-input placeholder="请输入内容" v-model="searchKeyword" class="input-with-select">
                            <template #suffix-icon>
                                <t-button @click="searchOnClick" shape="circle" variant="text">
                                    <t-icon name="search"></t-icon>
                                </t-button>
                            </template>
                        </t-input>
                    </t-space>
                </t-col>
            </t-row>
        </t-card>
        <!-- 表格 -->
        <ext-table :current-page="currentPage" :table-total="tableTotal" :page-size="pageSize" :table-data="tableData" :table-column="tableColumn" :table-action="tableAction" @pagechange="pageOnChange" @selectionchange="selectionOnChange" @formedit="formOnEdit" @dataupdate="dataOnUpdate"></ext-table>
        <t-drawer :visible.sync="dialogVisible" header="表单数据" :close-on-overlay-click="false" :close-on-esc-keydown="false" :size-draggable="true" :close-btn="true" @close-btn-click="closeOnClick" size="40%">
            <ext-form type="drawer" :form-field="formField" :form-value="formValue" :form-data="formData" :form-fields="formFields" @formcancel="closeOnClick"></ext-form>
        </t-drawer>
    </div>
</template>
<script>
import table from './table.vue'
import form from './form.vue'
export default {
    components: {
        'ext-table': table,
        'ext-form': form,
    },
    computed: {},
    watch: {
        'filterSetting': function(data) {

            var filterSelected = {};

            var query = this.$funs.cloneData(this.$route.query);

            for (var key in query) {
                if (query[key].indexOf('-') > -1) {
                    query[key] = query[key].split('-');
                }
            }

            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    var item = data[i];
                    var field = item.field;

                    filterSelected[field] = [];

                    if (query[field]) {

                        if (!Array.isArray(query[field])) {
                            filterSelected[field].push(query[field]);
                        } else {
                            filterSelected[field] = query[field];
                        }
                    }
                }
            }

            this.filterSelected = filterSelected;
        },
        'searchSetting': function(data) {
            if (data && data.length > 0) {
                if (this.searchField == '') {
                    this.searchField = data[0].value;
                }
            }
        },
    },
    mounted: function() {
        // 分析URL里面的参数
        this.parseQueryData();
        // 更新配置和数据
        this.getSettingAndData();
    },
    data: function() {
        return {
            // 搜索
            filterSetting: [],
            filterSelected: {},
            batchSetting: [],
            searchSetting: [],
            tableColumn: [],
            tableAction: [],
            tableData: [],
            tableTotal: 0,
            pageSize: 20,
            multipleSelection: [],
            currentPage: '',
            searchDate: [],
            searchField: '',
            searchComparator: '=',
            comparatorOptions: [
                { label: '=', value: '=' },
                { label: '≠', value: '!=' },
                { label: '<', value: '<' },
                { label: '>', value: '>' },
                { label: '≤', value: '<=' },
                { label: '≥', value: '>=' }
            ],
            searchKeyword: '',
            // 弹出层
            formData: {},
            formFields: [],
            formField: 0,
            formValue: 0,
            dialogVisible: false,
        }
    },
    methods: {
        fillData(formFields) {
            var data = {};

            for (var i = 0; i < formFields.length; i++) {
                data[formFields[i].name] = '';
            }

            return data;
        },
        fixedSearchSetting: function(data) {

            var searchSetting = [];

            var skipColKey = ['updatetime', 'createtime', 'row-select', 'row-operation']

            for (var i = 0; i < data.length; i++) {

                var item = data[i];

                if (skipColKey.indexOf(item.colKey) > -1) {
                    continue;
                }

                // 通过search属性控制是否要展示在搜索列表
                if (item.search == 1) {
                    searchSetting.push({
                        label: item.title,
                        value: item.colKey
                    });
                }

            }

            // 仅当搜索字段的数量大于0时，才显示搜索功能
            if (searchSetting.length > 0) {
                this.searchSetting = searchSetting;
            } else {
                this.searchSetting = [];
            }


        },
        fixedTableColumn: function(data) {
            var that = this;

            // 用表格字段配置生成搜索配置
            this.fixedSearchSetting(_.cloneDeep(data));

            // 要避免重复添加
            if (data[0].colKey != 'row-select') {


                // 往头部插入选择框
                data.unshift({
                    colKey: 'row-select',
                    type: 'multiple',
                    width: 50,
                });

                if (that.tableAction && that.tableAction.length > 0) {
                    // 往尾部插入操纵框
                    data.push({
                        colKey: 'row-operation',
                        title: '操作',
                        width: 120,
                        foot: '-',
                    });
                }

                if (data && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {

                        var type = data[i].type;

                        // 图片特别处理
                        if (type == 'image' || type == 'images') {

                            data[i]['render'] = function(h, context) {

                                if (context.type == 'title') {
                                    return context.col.title;
                                }

                                // 默认为单图片
                                var src = context.row[context.col.colKey];
                                var scrList = [src];
                                var gallery = false;

                                // 判断是否多图
                                if (context.col.type == 'images') {
                                    scrList = JSON.parse(context.row[context.col.colKey]);
                                    if (scrList) {
                                        src = scrList[0];
                                        gallery = true;
                                    }
                                }

                                return h('t-image-viewer', {
                                    attrs: {
                                        images: scrList,
                                        trigger: function(h2, context) {
                                            return h2('t-image', {
                                                style: { width: '30px', height: '30px', cursor: 'pointer' },
                                                attrs: { fit: 'cover', src: src, gallery: gallery },
                                                on: {
                                                    click: function() {
                                                        context.open();
                                                    }
                                                },
                                            });
                                        }
                                    },
                                });

                            }
                        }
                        // 图片特别处理结束

                        // 日期特别处理
                        if (type == 'datetime') {

                            data[i]['render'] = function(h, context) {

                                if (context.type == 'title') {
                                    return context.col.title;
                                }
                                return h('span', new Date(parseInt(context.row[context.col.colKey]) * 1000).toLocaleString());

                            }
                        }
                        // 日期特别处理结束

                    }
                }
            }

            return data;
        },
        reloadThisPage: function(query) {
            // 推送到新的路由地址后，当前页面的mounted方法会被触发，然后mounted里面回去调用getSettingAndData
            this.$router.push({ path: this.$route.path, query: query });
        },
        parseQueryData: function() {
            if (this.$route.query.searchDate) {
                var searchDate = decodeURIComponent(this.$route.query.searchDate).split('-');
                searchDate[0] = new Date(_.toSafeInteger(searchDate[0])).toLocaleString();
                searchDate[1] = new Date(_.toSafeInteger(searchDate[1])).toLocaleString();
                this.searchDate = searchDate;
            }
            if (this.$route.query.searchField) {
                this.searchField = decodeURIComponent(this.$route.query.searchField);
            }
            if (this.$route.query.searchComparator) {
                this.searchComparator = decodeURIComponent(this.$route.query.searchComparator);
            }
            if (this.$route.query.searchKeyword) {
                this.searchKeyword = decodeURIComponent(this.$route.query.searchKeyword);
            }
        },
        filterOnChange: function(item) {
            // 每一次变化，都重新处理

            var filterSelected = this.$funs.cloneData(this.filterSelected);

            // 遍历filterSelected对象，哪个有空字符串，就清除其他值
            for (var key in filterSelected) {
                var cur_item = filterSelected[key];
                for (var i = 0; i < cur_item.length; i++) {
                    var cur = cur_item[i];
                    if (cur === '') {
                        filterSelected[key] = [];
                    }
                }
            }

            // 生成新的query对象
            var query = {};
            for (var key in filterSelected) {
                var cur_item = filterSelected[key];
                if (cur_item.length == 1) {
                    query[key] = cur_item[0];
                } else if (cur_item.length > 1) {
                    query[key] = cur_item.join('-');
                }
            }

            this.filterSelected = filterSelected;

            this.reloadThisPage(query);

        },
        // 选择日期
        dateOnChange: function(value, context) {},
        //搜索
        searchOnClick: function() {
            var query = this.$funs.cloneData(this.$route.query);

            if (this.searchDate.length > 0) {
                var searchDate = [];
                searchDate[0] = new Date(this.searchDate[0]).valueOf();
                searchDate[1] = new Date(this.searchDate[1]).valueOf();
                query['searchDate'] = searchDate.join('-');
            }

            if (this.searchField.length > 0) {
                query['searchField'] = encodeURIComponent(this.searchField);
            }

            if (this.searchComparator.length > 0) {
                query['searchComparator'] = encodeURIComponent(this.searchComparator);
            }

            if (this.searchKeyword.length > 0) {
                query['searchKeyword'] = encodeURIComponent(this.searchKeyword);
            }

            this.reloadThisPage(query);
        },
        pageOnChange: function(page) {

            // 修改页码，然后通过路由触发数据更新

            var query = this.$funs.cloneData(this.$route.query);

            // 更新页码
            query['page'] = page;

            this.reloadThisPage(query);
        },
        selectionOnChange: function(value) {
            this.multipleSelection = value;
        },
        getSettingAndData: function() {

            var that = this;
            // 判断是否提供了获取数据的接口地址
            if (!this.$route.meta['api'] || !this.$route.meta['api']['table']) {
                this.$funs.errorMsg('当前菜单未提供表格配置数据接口');
                return;
            }
            var query = this.$funs.cloneData(this.$route.query);

            var param = {
                'hasSetting': 0,
                query: query,
            };

            // 直接复用配置数据
            if (this.$route.meta.setting && this.$route.meta.setting['tableColumn']) {
                param['hasSetting'] = 1;
                this.filterSetting = this.$route.meta.setting['filterSetting'];
                this.batchSetting = this.$route.meta.setting['batchSetting'];
                // tableAction的赋值必须放在tableColumn之前
                // fixedTableColumn会根据tableAction判断是否加上操作列
                this.tableAction = this.$route.meta.setting['tableAction'];
                this.tableColumn = this.fixedTableColumn(this.$route.meta.setting['tableColumn']);
                this.formFields = this.$route.meta.setting['formFields'];
            }

            // 通过后台获取数据
            this.$funs.post(this.$route.meta['api']['table'], param, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {
                    if (param['hasSetting'] == 0) {
                        that.$route.meta['setting'] = {};
                        that.filterSetting = that.$route.meta['setting']['filterSetting'] = result.filterSetting;
                        that.batchSetting = that.$route.meta['setting']['batchSetting'] = result.batchSetting;
                        that.tableAction = that.$route.meta['setting']['tableAction'] = result.tableAction;
                        that.tableColumn = that.$route.meta['setting']['tableColumn'] = that.fixedTableColumn(result.tableColumn);
                        that.formFields = that.$route.meta['setting']['formFields'] = result.formFields;
                    }

                    // 更新页码及总数
                    // tddesign的页码要求必须是整数，不能是字符串的数字——浪费几个小时排查问题
                    that.currentPage = query['page'] ? _.toSafeInteger(query['page']) : 1;
                    that.tableTotal = result.tableTotal ? result.tableTotal : 0;
                    that.pageSize = result.pageSize ? result.pageSize : 20;
                    // 更新表格数据
                    that.tableData = result.tableData ? result.tableData : [];

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
                that.$funs.errorMsg('获取表格数据失败败');
                that.$funs.errorMsg(raw_text);
            });
        },
        batchOnClick: function(item) {
            var that = this;

            if (item.action == 'add') {
                // 添加按钮
                this.showDrawerForm();
                return;
            }

            if (item.action == 'ajax') {
                // Ajax操作按钮
                // 必须是明确设置confirm为false，才不弹出提示
                if (item.confirm === false) {
                    this.batchAjax(item);
                    return;
                }

                this.$funs.confirmMsg(item.confirm ? item.confirm : '继续操作？', function() {
                    that.batchAjax(item);
                });

                return;
            }

            if (item.action == 'link') {
                // 跳转链接
                window.open(item.url);
                return;
            }
        },
        batchAjax: function(item) {

            var that = this;
            var rows = this.multipleSelection;

            if (rows.length <= 0) {
                this.$funs.errorMsg('请选择要处理的数据');
                return;
            }

            var data = [];
            var field = item.field;

            for (var i = 0; i < rows.length; i++) {

                var row = rows[i];

                if (row[field]) {
                    data.push(row[field]);
                    continue;
                }

                // 当前表数据为提供ID字段
                this.$funs.errorMsg('当前表数据未提供' + field + '字段');
                return;
            }

            var param = {
                field: field,
                data: data,
            };

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
                        }, 2000);
                    } else {
                        // 更新数据
                        that.getSettingAndData();
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
                that.$funs.errorMsg('批量处理数据失败');
                that.$funs.errorMsg(raw_text);
            });
        },
        showDrawerForm: function(formField, formValue) {

            var that = this;

            this.formField = formField;
            this.formValue = formValue;

            if (!this.$route.meta['api'] || !this.$route.meta['api']['form']) {
                this.$funs.errorMsg('当前菜单未提供获取表单配置数据接口');
                return;
            }
            var param = {
                'hasSetting': 0,
                'formAction': 'get',
                'formField': formField,
                'formValue': formValue,
            };

            // 判断是否已经有表单配置缓存
            if (this.$route.meta.setting && this.$route.meta.setting['formFields']) {
                param['hasSetting'] = 1;
                // 如果没有指定ID，说明是新增表单数据
                if (!formValue) {

                    this.formFields = this.$route.meta.setting['formFields'];
                    // 直接显示表单
                    this.formData = this.fillData(this.formFields);
                    this.dialogVisible = true;
                    return;
                }
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
                    that.formData = result.formData ? result.formData : that.fillData(that.formFields);
                    that.dialogVisible = true;
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
        formOnEdit: function(field, value) {
            this.showDrawerForm(field, value);
        },
        dataOnUpdate: function() {
            // 更新数据
            this.getSettingAndData();
        },
        closeOnClick(context) {
            console.log('closeOnClick');
            // 不询问，直接关闭表单
            this.dialogVisible = false;
            // 更新数据
            this.getSettingAndData();
        },
        cascaderOnChange: function(value, context) {
            console.log(value);
            console.log(context);
        },
    }
}
</script>
<style>
.admin-table-page .t-card.admin-table-page-table-panel {
    border: 1px solid #EBEEF5;
    border-bottom: none;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.admin-table-page-table-panel-right {
    text-align: right;
}

.admin-table-page-select-filter-item {
    display: flex;
    margin-top: 15px;
    margin-bottom: 15px;
}

.admin-table-page-select-filter-item-label {
    line-height: 30px;
}

.admin-table-page-select-filter-item .t-tag {
    padding: 14px 16px;
    border-radius: 30px;
}
</style>