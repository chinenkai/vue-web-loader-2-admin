export default [
    {
        type: 'html',
        label: '原生Html',
        content: '<span><i>原生html，用来展示数据</i></span>',
    },
    {
        type: 'cascader',
        label: '级联选择器',
        name: 'cascader1',
        max: 2,
        disabled: false,
        defaultValue: "c5",
        options: [
            {
                label: '选项1',
                value: 'c1',
                children: [
                    {
                        label: '选项4',
                        value: 'c4',
                    },
                    {
                        label: '选项5',
                        value: 'c5',
                    },
                ],
            },
            {
                label: '选项2',
                value: 'c2',
            },
            {
                label: '选项3',
                value: 'c3',
            },
        ],
    },
    {
        type: 'checkbox-group',
        label: '多选框',
        name: 'checkboxGroup1',
        max: 2,
        disabled: false,
        defaultValue: ["c1", "c3"],
        options: [
            {
                label: '选项1',
                value: 'c1',
            },
            {
                label: '选项2',
                value: 'c2',
            },
            {
                label: '选项3',
                value: 'c3',
            },
        ],
    },
    {
        type: 'color-picker',
        label: '颜色选择器',
        name: 'colorPicker1',
        format: 'RGBA',
        enableAlpha: true,
    },
    {
        type: 'date-picker',
        label: '日期选择器',
        name: 'datePicker1',
        defaultValue: '1988-02-24 00:00:00',
        enableTimePicker: true,
    },
    {
        type: 'date-range-picker',
        label: '日期段选择器',
        name: 'dateRangePicker1',
    },
    {
        type: 'input',
        label: '输入框',
        name: 'input1',
    },
    {
        type: 'input-adornment',
        label: '输入装饰器',
        name: 'inputAdornment1',
        prepend: '前置内容',
        append: '后置内容',
    },
    {
        type: 'input-number',
        label: '数字输入框',
        name: 'inputNumber1',
        defaultValue: 198,
    },
    {
        type: 'tag-input',
        label: '标签输入框',
        name: 'tagInput1',
        defaultValue: ['a', 'b'],
    },
    {
        type: 'radio-group',
        label: '多选框',
        name: 'radioGroup1',
        disabled: false,
        defaultValue: "r3",
        options: [
            {
                label: 'R选项1',
                value: 'r1',
            },
            {
                label: 'R选项2',
                value: 'r2',
            },
            {
                label: 'R选项3',
                value: 'r3',
            },
        ],
    },
    {
        type: 'range-input',
        label: '范围输入框',
        name: 'rangeInput1',
    },
    {
        type: 'select',
        label: '下拉选择框',
        name: 'select1',
        // defaultValue: "s3",
        multiple: true,
        options: [
            {
                label: 'S选项1',
                value: 's1',
            },
            {
                label: 'S选项2',
                value: 's2',
            },
            {
                label: 'S选项3',
                value: 's3',
            },
        ],
    },
    {
        type: 'slider',
        label: '滑块',
        name: 'slider1',
        range: true,
    },
    {
        type: 'switch',
        label: '开关',
        name: 'switch1',
        // defaultValue: "关",
        customValue: ['开', '关'],
    },
    {
        type: 'textarea',
        label: '多行文本框',
        name: 'textarea1',
    },
    {
        type: 'time-picker',
        label: '时间选择器',
        name: 'time-picker1',
    },
    {
        type: 'time-range-picker',
        label: '时间段选择器',
        name: 'time-range-picker1',
    },
    {
        type: 'upload',
        label: '上传文件',
        name: 'upload1',
        action: '../admin/attachment/upload/?fileKey=upload1',
        theme: 'file-input',
        placeholder: '请选择文件',
        defaultValue: [
            {
                name: '1.png',
                url: 'http://www.aaa.xxx/1.png'
            },
        ],
    },
    {
        type: 'upload',
        label: '上传图片',
        name: 'upload2',
        action: '../admin/attachment/upload/?fileKey=upload2',
        theme: 'image',
        placeholder: '请选择图片',
        multiple: true,
        defaultValue: [
            {
                name: 'bg.jpg',
                url: 'http://2024.h5pro.cn/upload/demo/bg.20240608.jpg'
            },
        ],
    },
];