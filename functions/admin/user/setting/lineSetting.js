const lineSeries = [{
    title: '状态0',
    condition: ['`status` = 0'],
}, {
    title: '状态1',
    condition: ['`status` = 1'],
}, {
    title: '状态2',
    condition: ['`status` = 2'],
}, {
    title: '状态3',
    condition: ['`status` = 3'],
}, ];

export default [{
        title: '今天',
        starttime: 'today',
        endtime: 'tomorrow',
        xaxis: 'hour',
        field: 'createtime',
        series: lineSeries,
    },
    {
        title: '昨天',
        starttime: 'yesterday',
        endtime: 'today',
        xaxis: 'hour',
        field: 'createtime',
        series: lineSeries,
    },
    {
        title: '最近7天',
        starttime: 'last7day',
        endtime: 'tomorrow',
        xaxis: 'date',
        field: 'createtime',
        series: lineSeries,
    },
    {
        title: '最近30天',
        starttime: 'lastmonth',
        endtime: 'tomorrow',
        xaxis: 'date',
        field: 'createtime',
        series: lineSeries,
    },
    {
        title: '最近一年',
        starttime: 'lastyear',
        endtime: 'nextmonth',
        xaxis: 'month',
        field: 'createtime',
        series: lineSeries,
    },
];