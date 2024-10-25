<template>
    <div class="admin-form">
        <t-form class="admin-form-content" label-align="right" label-width="120px">
            <t-form-item v-for="(item, idx1) in formFields" :key="idx1" :label="item.label" :name="item.name" v-on:click.native="formItemOnClick(item.name)">
                <t-cascader v-if="item.type == 'cascader'" v-model="formData[item.name]" :options="item.options" :check-strictly="check(item.checkStrictly,false)" :clearable="check(item.clearable,false)" :disabled="check(item.disabled,false)" :filterable="check(item.filterable,false)" :max="check(item.max,0)" :min-collapsed-num="check(item.minCollapsedNum,0)" :multiple="check(item.multiple,false)" :placeholder="check(item.placeholder,'')" :readonly="check(item.readonly,false)" :reserve-keyword="check(item.reserveKeyword,false)" :show-all-levels="check(item.showAllLevels,true)" :size="check(item.size,'medium')" :status="check(item.status,'default')" :suffix="check(item.suffix,'')" :tips="check(item.tips,'')" :value-display="check(item.valueDisplay,'')" :value-mode="check(item.valueMode,'onlyLeaf')" :value-type="check(item.valueType,'single')"></t-cascader>
                <t-checkbox-group v-if="item.type == 'checkbox-group'" v-model="formData[item.name]" :options="item.options" :max="check(item.max,0)" :disabled="check(item.disabled,false)"></t-checkbox-group>
                <t-color-picker v-if="item.type == 'color-picker'" v-model="formData[item.name]" :clearable="check(item.clearable,false)" :color-modes="check(item.colorModes,['monochrome', 'linear-gradient'])" :disabled="check(item.disabled,false)" :enable-alpha="check(item.enableAlpha,false)" :enable-multiple-gradient="check(item.enableMultipleGradient,true)" :format="check(item.format,'RGB')" :multiple="check(item.multiple,false)" :show-primary-color-preview="check(item.showPrimaryColorPreview,true)" :size="check(item.size,'medium')"></t-color-picker>
                <t-date-picker v-if="item.type == 'date-picker'" v-model="formData[item.name]" :allow-input="check(item.allowInput,false)" :clearable="check(item.clearable,false)" :disable-date="check(item.disableDate,[])" :disabled="check(item.disabled,false)" :enable-time-picker="check(item.enableTimePicker,false)" :first-day-of-week="check(item.firstDayOfWeek,'')" :format="check(item.format,'')" :mode="check(item.mode,'date')" :placeholder="check(item.placeholder)" :presets="check(item.presets,{})" :presets-placement="check(item.presetsPlacement,'bottom')" :size="check(item.size,'medium')" :status="check(item.status,'default')" :tips="check(item.tips,'')" :value="check(item.value,'')" :default-value="check(item.defaultValue,'')" :value-type="check(item.valueType,'')"></t-date-picker>
                <t-date-range-picker v-if="item.type == 'date-range-picker'" v-model="formData[item.name]" :allow-input="check(item.allowInput,false)" :clearable="check(item.clearable,false)" :disable-date="check(item.disableDate,[])" :disabled="check(item.disabled,false)" :enable-time-picker="check(item.enableTimePicker,false)" :first-day-of-week="check(item.firstDayOfWeek,'')" :format="check(item.format,'')" :mode="check(item.mode,'date')" :panel-preselection="check(item.panelPreselection,true)" :placeholder="check(item.placeholder,'')" :presets="check(item.presets,{})" :presets-placement="check(item.presetsPlacement,'bottom')" :separator="check(item.separator,'')" :size="check(item.size,'medium')" :status="check(item.status,'default')" :tips="check(item.tips,'')" :value-type="check(item.valueType,'')"></t-date-range-picker>
                <t-input v-if="item.type == 'input'" v-model="formData[item.name]" :align="check(item.align,'left')" :allow-input-over-max="check(item.allowInputOverMax,false)" :auto-width="check(item.autoWidth,false)" :autocomplete="check(item.autocomplete,'off')" :autofocus="check(item.autofocus,false)" :borderless="check(item.borderless,false)" :clearable="check(item.clearable,false)" :disabled="check(item.disabled,false)" :format="check(item.format,'')" :input-class="check(item.inputClass,'')" :maxcharacter="check(item.maxcharacter,undefined)" :maxlength="check(item.maxlength,undefined)" :name="check(item.name,'')" :placeholder="check(item.placeholder,'')" :readonly="check(item.readonly,false)" :show-clear-icon-on-empty="check(item.showClearIconOnEmpty,false)" :show-limit-number="check(item.showLimitNumber,false)" :size="check(item.size,'medium')" :status="check(item.status,undefined)" :suffix="check(item.suffix,'')" :tips="check(item.tips,'')" :type="check(item.type,'text')"></t-input>
                <t-input-adornment v-if="item.type == 'input-adornment'" :prepend="check(item.prepend,'')" :append="check(item.append,'')">
                    <t-input v-model="formData[item.name]" :align="check(item.align,'left')" :allow-input-over-max="check(item.allowInputOverMax,false)" :auto-width="check(item.autoWidth,false)" :autocomplete="check(item.autocomplete,'off')" :autofocus="check(item.autofocus,false)" :borderless="check(item.borderless,false)" :clearable="check(item.clearable,false)" :disabled="check(item.disabled,false)" :format="check(item.format,'')" :input-class="check(item.inputClass,'')" :maxcharacter="check(item.maxcharacter,undefined)" :maxlength="check(item.maxlength,undefined)" :name="check(item.name,'')" :placeholder="check(item.placeholder,'')" :readonly="check(item.readonly,false)" :show-clear-icon-on-empty="check(item.showClearIconOnEmpty,false)" :show-limit-number="check(item.showLimitNumber,false)" :size="check(item.size,'medium')" :status="check(item.status,undefined)" :suffix="check(item.suffix,'')" :tips="check(item.tips,'')" :type="check(item.type,'text')"></t-input>
                </t-input-adornment>
                <t-input-number v-if="item.type == 'input-number'" v-model="formData[item.name]" :align="check(item.align,'center')" :allow-input-over-limit="check(item.allowInputOverLimit,true)" :auto-width="check(item.autoWidth,false)" :decimal-places="check(item.decimalPlaces,0)" :disabled="check(item.disabled,false)" :large-number="check(item.largeNumber,false)" :max="check(item.max,Infinity)" :min="check(item.min,-Infinity)" :placeholder="check(item.placeholder,'')" :readonly="check(item.readonly,false)" :size="check(item.size,'medium')" :status="check(item.status,'default')" :step="check(item.step,1)" :suffix="check(item.suffix,'')" :theme="check(item.theme,'row')" :tips="check(item.tips,'')"></t-input-number>
                <t-tag-input v-if="item.type == 'tag-input'" v-model="formData[item.name]" :auto-width="check(item.autoWidth,false)" :clearable="check(item.clearable,false)" :disabled="check(item.disabled,false)" :drag-sort="check(item.dragSort,false)" :excess-tags-display-type="check(item.excessTagsDisplayType,'break-line')" :max="check(item.max,Infinity)" :min-collapsed-num="check(item.minCollapsedNum,0)" :placeholder="check(item.placeholder,'')" :readonly="check(item.readonly,false)" :size="check(item.size,'medium')" :status="check(item.status,'')" :suffix="check(item.suffix,'')" :tag="check(item.tag,null)" :tips="check(item.tips,'')" :value-display="check(item.valueDisplay,null)"></t-tag-input>
                <t-radio-group v-if="item.type == 'radio-group'" v-model="formData[item.name]" :options="item.options" :allow-uncheck="check(item.allowUncheck,false)" :disabled="check(item.disabled,false)" :name="check(item.name,'')" :size="check(item.size,'medium')" :variant="check(item.variant,'outline')"></t-radio-group>
                <t-range-input v-if="item.type == 'range-input'" v-model="formData[item.name]" :active-index="check(item.activeIndex,null)" :clearable="check(item.clearable,false)" :disabled="check(item.disabled,false)" :format="check(item.format,null)" :placeholder="check(item.placeholder,'')" :readonly="check(item.readonly,false)" :separator="check(item.separator,'-')" :show-clear-icon-on-empty="check(item.showClearIconOnEmpty,false)" :size="check(item.size,'medium')" :status="check(item.status,'default')" :suffix="check(item.suffix,'')" :tips="check(item.tips,'')"></t-range-input>
                <t-select v-if="item.type == 'select'" v-model="formData[item.name]" :options="item.options" :auto-width="check(item.autoWidth,false)" :autofocus="check(item.autofocus,false)" :borderless="check(item.borderless,false)" :clearable="check(item.clearable,false)" :creatable="check(item.creatable,false)" :disabled="check(item.disabled,false)" :empty="check(item.empty,'')" :filter="check(item.filter,'')" :filterable="check(item.filterable,false)" :max="check(item.max,Infinity)" :min-collapsed-num="check(item.minCollapsedNum,0)" :multiple="check(item.multiple,false)" :panel-bottom-content="check(item.panelBottomContent,'')" :panel-top-content="check(item.panelTopContent,'')" :placeholder="check(item.placeholder,'')" :readonly="check(item.readonly,false)" :reserve-keyword="check(item.reserveKeyword,false)" :show-arrow="check(item.showArrow,true)" :size="check(item.size,'medium')" :status="check(item.status,'default')" :suffix="check(item.suffix,'')" :tips="check(item.tips,'')" :value-display="check(item.valueDisplay,null)" :value-type="check(item.valueType,'value')"></t-select>
                <t-slider v-if="item.type == 'slider'" v-model="formData[item.name]" :disabled="check(item.disabled,false)" :input-number-props="check(item.inputNumberProps,false)" :label="check(item.sliderLabel,true)" :layout="check(item.layout,'horizontal')" :marks="check(item.marks,null)" :max="check(item.max,100)" :min="check(item.min,0)" :range="check(item.range,false)" :step="check(item.step,1)"></t-slider>
                <t-switch v-if="item.type == 'switch'" v-model="formData[item.name]" :custom-value="check(item.customValue,[true, false])" :disabled="check(item.disabled,false)" :label="check(item.switchLabel,['✔','❌'])" :size="check(item.size,'large')"></t-switch>
                <t-textarea v-if="item.type == 'textarea'" v-model="formData[item.name]" :autofocus="check(item.autofocus,false)" :autosize="check(item.autosize,false)" :disabled="check(item.disabled,false)" :maxcharacter="check(item.maxcharacter,undefined)" :maxlength="check(item.maxlength,undefined)" :name="check(item.name,'')" :placeholder="check(item.placeholder,'')" :readonly="check(item.readonly,false)" :status="check(item.status,'')" :tips="check(item.tips,'')"></t-textarea>
                <t-time-picker v-if="item.type == 'time-picker'" v-model="formData[item.name]" :allow-input="check(item.allowInput,false)" :clearable="check(item.clearable,false)" :disabled="check(item.disabled,false)" :format="check(item.format,'HH:mm:ss')" :hide-disabled-time="check(item.hideDisabledTime,true)" :placeholder="check(item.placeholder,'')" :presets="check(item.presets,{})" :size="check(item.size,'medium')" :status="check(item.status,'default')" :steps="check(item.steps,[1, 1, 1])" :tips="check(item.tips,'')"></t-time-picker>
                <t-time-range-picker v-if="item.type == 'time-range-picker'" v-model="formData[item.name]" :allow-input="check(item.allowInput,false)" :clearable="check(item.clearable,false)" :disabled="check(item.disabled,false)" :format="check(item.format,'HH:mm:ss')" :hide-disabled-time="check(item.hideDisabledTime,true)" :placeholder="check(item.placeholder,'')" :presets="check(item.presets,{})" :size="check(item.size,'medium')" :status="check(item.status,'default')" :steps="check(item.steps,[1, 1, 1])" :tips="check(item.tips,'')"></t-time-range-picker>
                <!--   -->
                <t-upload v-if="item.type == 'upload'" v-model="formData[item.name]" :format-request="formatRequest" :format-response="formatResponse" @fail="uploadOnFail" @success="uploadOnSuccess" :action="check(item.action,'')" :abridge-name="check(item.abridgeName,null)" :accept="check(item.accept,'')" :allow-upload-duplicate-file="check(item.allowUploadDuplicateFile,false)" :auto-upload="check(item.autoUpload,true)" :disabled="check(item.disabled,false)" :draggable="check(item.draggable,undefined)" :headers="check(item.headers,undefined)" :is-batch-upload="check(item.isBatchUpload,false)" :max="check(item.max,0)" :method="check(item.method,'POST')" :mock-progress-duration="check(item.mockProgressDuration,300)" :multiple="check(item.multiple,false)" :name="check(item.name,'file')" :placeholder="check(item.placeholder,'')" :show-image-file-name="check(item.showImageFileName,true)" :show-thumbnail="check(item.showThumbnail,false)" :show-upload-progress="check(item.showUploadProgress,true)" :size-limit="check(item.sizeLimit,5000)" :status="check(item.status,'')" :theme="check(item.theme,'file')" :tips="check(item.tips,'')" :upload-all-files-in-one-request="check(item.uploadAllFilesInOneRequest,false)" :upload-pasted-files="check(item.uploadPastedFiles,true)" :use-mock-progress="check(item.useMockProgress,true)" :with-credentials="check(item.withCredentials,false)"></t-upload>
                <div v-if="item.type == 'html'" v-html="formData[item.name]?formData[item.name]:item.content"></div>
                <!-- demo -->
                <!-- <t-xxx-xxx v-if="item.type == 'xxx-xxx'" v-model="formData[item.name]"></t-xxx-xxx> -->
            </t-form-item>
            <t-form-item v-if="type == 'card'">
                <t-button @click="submitOnClick">提交</t-button>
            </t-form-item>
        </t-form>
        <div class="admin-form-footer" v-if="type == 'drawer'">
            <t-space size="small">
                <t-button @click="cancelOnClick" theme="default" variant="outline">取消</t-button>
                <t-button @click="submitOnClick">提交</t-button>
            </t-space>
        </div>
    </div>
</template>
<script>
export default {
    props: ['type', 'formField', 'formValue', 'formData', 'formFields'],
    computed: {},
    watch: {
        'formData': function(data) {
            // console.log(data);
            var formFields = this.formFields;

            var bothTypes = ['select', 'slider']

            var arrTypes = ['checkbox-group', 'date-range-picker', 'tag-input', 'range-input', 'time-range-picker', 'upload'];

            var strTypes = ['cascader', 'color-picker', 'date-picker', 'input', 'input-adornment', 'input-number', 'radio-group', 'textarea', 'time-picker'];

            var boolTypes = ['switch'];



            for (var i = 0; i < formFields.length; i++) {

                var item = formFields[i];
                var type = item.type;
                var name = item.name;
                // 如果有数据，则直接使用数据
                if (data[name] !== undefined && data[name] !== '') {
                    continue;
                }

                // 如果配置里提供了默认数据，则使用默认数据
                if (item.defaultValue !== undefined) {
                    data[name] = item.defaultValue;
                    continue;
                }

                // 既可以是数组，也可以是字符串
                if (bothTypes.indexOf(type) != -1) {

                    data[name] = '';

                    // 数组或字符串，根据multiple值确定
                    if (item.multiple !== undefined) {
                        data[name] = item.multiple ? [] : '';
                    }

                    if (item.range !== undefined) {
                        data[name] = item.range ? [0, 50] : '';
                    }
                    continue;
                }

                // 值为数组类型
                if (arrTypes.indexOf(type) != -1) {
                    data[name] = [];
                    continue;
                }

                // 值为字符串类型
                if (strTypes.indexOf(type) != -1) {
                    data[name] = '';
                    continue;
                }

                // 值为布尔值类型
                if (boolTypes.indexOf(type) != -1) {
                    // 针对switch组件做特殊处理
                    if (item.customValue) {
                        // 取第一个值
                        data[name] = item.customValue[0];
                    } else {
                        data[name] = true;
                    }
                    continue;
                }
            }
            return data;
        }
    },
    mounted: function() {},
    data: function() {
        return {
            curItemName: '',
        }
    },
    methods: {
        check: function(value, defaultValue) {
            return value !== undefined ? value : defaultValue;
        },
        formItemOnClick: function(name) {
            this.curItemName = name;
        },
        formatRequest: function(param) {

            param['token'] = this.$funs.cache('token');

            return param;
        },
        formatResponse: function(response, context) {
            console.log(response);

            if (response.status != 1) {
                return {
                    error: response.msg
                }
            }

            return {
                url: response.url,
            }
        },
        uploadOnFail: function(context) {
            this.$funs.errorMsg(context.file.response.error);
        },
        uploadOnSuccess: function(context) {
            var result = context.response;

            if (result.status == 0) {
                // 上传失败
                return this.$funs.errorMsg(result.msg);
            }

            // 准备文件对应表单字段对象，删除多余的信息即可
            var formatData = [];

            var fileList = this.formData[this.curItemName];

            for (var i = 0; i < fileList.length; i++) {

                var item = fileList[i];

                formatData[i] = {
                    lastModified: item['lastModified'],
                    name: item['name'],
                    size: item['size'],
                    type: item['type'],
                    uploadTime: item['uploadTime'],
                    url: item['url'],
                }
            }

            this.formData[this.curItemName] = formatData;

            this.$funs.successMsg('上传成功');
        },
        submitOnClick: function() {
            var that = this;

            if (!this.$route.meta['api'] || !this.$route.meta['api']['form']) {
                this.$funs.errorMsg('当前菜单未提供获取表单配置数据接口');
                return;
            }

            var param = {
                'hasSetting': 0,
                'formAction': this.formField ? 'set' : 'add',
                'formField': this.formField,
                'formValue': this.formValue,
                'data': this.formData,
            };

            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(this.$route.meta['api']['form'], param, function(result) {

                // 弹出提交成功的消息
                if (result.status == 1) {
                    that.$funs.successMsg(result.msg);
                    return;
                }

                // 弹出错误信息
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
        cancelOnClick: function() {
            this.$emit('formcancel');
        },

    },
}
</script>
<style>
.admin-form {}

.admin-form .admin-form-content {
    padding: 20px 32px 20px 32px;
}

.admin-form .admin-form-footer {
    position: absolute;
    width: 100%;
    padding: 15px 0;
    padding-right: 40px;
    bottom: 0;
    text-align: right;
    background-color: #fff;
    z-index: 999999;
}
</style>