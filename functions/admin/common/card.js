import { time, get_zero_time, is_json } from '../../core/utils.js';
import lodash from "../../libs/lodash.js"
import dayjs from "../../libs/day.js"
import model from "../../core/model.js"
class card {
    constructor(args) {
        this._ctx = args._ctx;
        this._controller = args._controller;
        this._action = args._action;
        this._db = args._db;
        this._kv = args._kv;
        this._get = args._get;
        this._post = args._post;
        this._headers = args._headers;
        this._hook = args._hook;
        this._token = args._token;
        this._setting = args._setting;
    }

    async calculate_count_data(cur_model, setting) {
        for (let k1 in setting) {
            for (let k2 in setting[k1]) {
                let v2 = setting[k1][k2];
                if (Array.isArray(v2)) {
                    let str = "";
                    if (typeof v2[0] === 'string') {
                        str = v2[0];
                    }
                    for (let k3 in v2) {
                        if (typeof v2[k3] === 'object' && v2[k3] !== null) {
                            for (let k4 in v2[k3]) {
                                str = str.replace(`{${k4}}`, await cur_model.count(v2[k3][k4]));
                            }
                        }
                    }
                    setting[k1][k2] = str;
                }
            }
        }
        return setting;
    }

    calculate_line_setting(setting) {

        let temp = {};

        for (var i in setting) {

            if (i == 'starttime' || i == 'endtime') {
                temp[i] = get_zero_time(setting[i]);
                continue;
            }

            temp[i] = setting[i];
        }

        return temp;
    }

    calculate_labels(starttime, endtime, xaxis) {
        const start = dayjs.unix(starttime);
        const end = dayjs.unix(endtime);
        const labels = [];

        let current = start.clone();

        while (current.isBefore(end) || current.isSame(end)) {
            switch (xaxis) {
                case 'minute':
                    labels.push(current.format('YYYY-MM-DD HH:mm'));
                    current = current.add(1, 'minute');
                    break;
                case 'hour':
                    labels.push(current.format('YYYY-MM-DD HH:mm'));
                    current = current.add(1, 'hour');
                    break;
                case 'date':
                    labels.push(current.format('YYYY-MM-DD'));
                    current = current.add(1, 'day');
                    break;
                case 'month':
                    labels.push(current.format('YYYY-MM'));
                    current = current.add(1, 'month');
                    break;
                default:
                    throw new Error('Invalid xaxis type. Must be "hour", "date", or "month".');
            }
        }

        return labels;

    }

    get_format(xaxis) {
        let sqlformat;

        switch (xaxis) {
            case 'minute':
                return '%Y-%m-%d %H:%M';
                break;
            case 'hour':
                return '%Y-%m-%d %H';
                break;
            case 'date':
                return '%Y-%m-%d';
                break;
            case 'month':
                return '%Y-%m';
                break;
            default:
                // Handle default case if needed
                break;
        }

        return '';
    }

    async add_random_data(cur_model) {
        let time = parseInt((new Date().getTime() / 1000).toFixed(0));
        for (var i = 0; i < 10000; i++) {
            time = (time - lodash.random(0, 1000))
            let re = await cur_model.create({
                name: ('name' + i).toString(),
                remark: ['one', 'two', 'thr'][lodash.random(0, 2)],
                createtime: time,
                updatetime: time,
            });
        }
    }

    async calculate_datasets(setting, labels) {

        const field = setting.field;

        const series = setting.series;
        const starttime = setting.starttime;
        const endtime = setting.endtime;

        const colors = [
            'rgb(255, 99, 132)', // red
            'rgb(255, 159, 64)', // orange
            'rgb(255, 205, 86)', // yellow
            'rgb(75, 192, 192)', // green
            'rgb(54, 162, 235)', // blue
            'rgb(153, 102, 255)', // purple
            'rgb(201, 203, 207)' // grey
        ];

        let datasets = [];

        for (var i = 0; i < series.length; i++) {

            let condition = series[i].condition;

            let sqlformat = this.get_format(setting.xaxis);

            let table_name = this._controller;

            let sql = "SELECT strftime('" + sqlformat + "', datetime(`" + field + "`, 'unixepoch', 'localtime')) AS temptime, count(*) AS num FROM " + table_name + " WHERE `" + field + "` >= " + starttime + " AND `" + field + "` < " + endtime + " AND " + condition[0] + " GROUP BY temptime";

            const { results } = await this._db.prepare(sql).all();

            let data = [];

            for (var j = 0; j < labels.length; j++) {

                data[j] = 0;

                let d1 = dayjs(labels[j]);

                for (var k = 0; k < results.length; k++) {

                    let d2 = dayjs(results[k].temptime);

                    if (d2.isSame(d1)) {
                        data[j] = results[k].num;
                    }
                }
            }

            datasets.push({
                label: series[i].title,
                data: data,
                type: series[i].type ? series[i].type : 'line',
                borderColor: colors[i % 7],
                backgroundColor: colors[i % 7],
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            });

        }

        return datasets;

    }

    async respond() {

        let result = {};

        const param = JSON.parse(this._post['param']);

        const cur_model = new model(this._db, this._controller);
        // 测试添加数据，暂时不删~
        // await this.add_random_data(cur_model);

        if (param.hasSetting == 0) {
            // 因为配置对象会被修改，所以这里需要深克隆，避免刷新时没有重新统计数据。
            result.countSetting = await this.calculate_count_data(cur_model, JSON.parse(JSON.stringify(this._setting.countSetting)));
            result.lineSetting = this._setting.lineSetting;
        }

        // 如果指定了序号，则获取对应序号的配置，然后统计数据
        if (param.index !== undefined && this._setting.lineSetting[param.index]) {
            // 受cloudflares运行时影响，必须在请求时获取时间
            // https://stackoverflow.com/questions/58491003/how-to-get-the-current-date-in-a-cloudflares-worker
            const setting = this.calculate_line_setting(this._setting.lineSetting[param.index]);
            const labels = this.calculate_labels(setting.starttime, setting.endtime, setting.xaxis);
            const datasets = await this.calculate_datasets(setting, labels);
            result.lineOption = { labels: labels, datasets: datasets };
        }

        return [1, '获取数据成功', result];
    }
}

export default card;
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}