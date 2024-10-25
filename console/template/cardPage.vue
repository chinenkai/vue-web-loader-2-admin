<template>
    <div class="admin-card-page">
        <t-row :gutter="15">
            <t-col :lg="3" :sm="12" v-for="item in countSetting">
                <t-card :shadow="false" class="admin-card-page-card">
                    <div class="admin-card-page-statistic" @click="statisticOnClick(item.url)">
                        <div class="admin-card-page-statistic-title">
                            {{ item.title }}
                        </div>
                        <div class="admin-card-page-statistic-content">
                            <span class="admin-card-page-statistic-content-value">{{ item.content }}</span>
                            <span v-if="item.suffix" class="admin-card-page-statistic-content-suffix">{{ item.suffix }}</span>
                        </div>
                        <div class="admin-card-page-statistic-desc">
                            <span>{{ item.desc }}</span>
                        </div>
                    </div>
                </t-card>
            </t-col>
        </t-row>
        <t-card :shadow="false" class="admin-card-page-card">
            <t-tabs tab-position="top" @change="tabOnChange" v-model="tabsValue">
                <t-tab-panel v-for="(item,index) in lineSetting" :value="index" :label="item.title">
                    <canvas class="line-data-box" :ref="'lineDataBox'+index"></canvas>
                </t-tab-panel>
            </t-tabs>
        </t-card>
    </div>
</template>
<script>
export default {
    components: {},
    computed: {},
    data: function() {
        return {
            tabsValue: 0,
            countSetting: [],
            lineSetting: [],
            lineDataBox: [],
        }
    },
    mounted: function() {
        // 初始化页面数据
        console.log('in cardPage mounted ');
        this.getSettingAndData();
    },
    methods: {
        statisticOnClick: function(url) {
            if (url) {
                this.$router.push({ path: url });
            }
        },
        tabOnChange: function(index) {
            this.getLineData(this.lineSetting[index], index);
        },
        getFirstLineData: function() {

            if (!this.lineSetting || this.lineSetting.length <= 0) {
                this.$funs.errorMsg('未提供折线图配置数据');
                return;
            }

            this.getLineData(this.lineSetting[0], 0);
        },
        getLineData: function(item, index) {

            var that = this;

            var param = {
                'hasSetting': 1,
                index: index,
            }

            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(this.$route.meta['api']['card'], param, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {

                    var ctx = that.$refs['lineDataBox' + index][0];

                    new Chart(ctx, {
                        type: 'line',
                        data: result.lineOption,
                        options: {
                            responsive: true,
                            plugins: {
                                tooltip: {
                                    mode: 'index',
                                    intersect: false
                                },
                            },
                            hover: {
                                mode: 'index',
                                intersec: false
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        },
                    });

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
                that.$funs.errorMsg('获取统计数据失败败');
                that.$funs.errorMsg(raw_text);
            });
        },
        getSettingAndData: function() {

            console.log('in cardPage getSettingAndData');

            var that = this;

            if (!this.$route.meta['api'] || !this.$route.meta['api']['card']) {
                this.$funs.errorMsg('当前菜单未提供统计配置数据接口');
                return;
            }

            var param = {
                'hasSetting': 0,
            }

            // 直接复用配置数据
            if (this.$route.meta.setting && this.$route.meta.setting['countSetting'] && this.$route.meta.setting['lineSetting']) {
                param['hasSetting'] = 1;
                this.countSetting = this.$route.meta.setting['countSetting'];
                this.lineSetting = this.$route.meta.setting['lineSetting'];
                // 获取第一个折线图统计数据
                this.getFirstLineData();
                return;
            }


            // 其他情况，都尝试通过后台获取表单字段和表单数据
            this.$funs.post(this.$route.meta['api']['card'], param, function(result) {

                // 状态1表示调用接口成功
                if (result.status == 1) {

                    if (param['hasSetting'] == 0) {
                        if (!that.$route.meta['setting']) {
                            that.$route.meta['setting'] = {};
                        }
                        that.countSetting = that.$route.meta['setting']['countSetting'] = result.countSetting;
                        that.lineSetting = that.$route.meta['setting']['lineSetting'] = result.lineSetting;
                    }

                    // 获取第一个折线图统计数据
                    that.getFirstLineData();
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
                that.$funs.errorMsg('获取统计数据失败败');
                that.$funs.errorMsg(raw_text);
            });
        },
    }
}
</script>
<style>
.admin-card-page-statistic {
    cursor: pointer;
}

.admin-card-page-statistic-title {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.admin-card-page-statistic-tips {
    margin-left: 5px;
}

.admin-card-page-statistic-content {
    font-size: 20px;
    color: rgb(51, 51, 51);
}

.admin-card-page-statistic-content-value {
    font-weight: 700;
}

.admin-card-page-statistic-content-suffix {
    margin-left: 5px;
    font-size: 12px;
}

.admin-card-page-statistic-desc {
    margin-top: 10px;
    color: rgb(153, 153, 153);
}

.admin-card-page-statistic-desc span {
    font-size: 12px;
}

.dark .admin-card-page-statistic-content {
    color: rgb(208, 208, 208);
}

.admin-card-page-card {
    margin-bottom: 15px;
}

.line-data-box {
    width: 100%;
    height: 500px;
    padding: 20px;
}
</style>