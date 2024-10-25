<template>
    <div class="">
    </div>
</template>
<script>
export default {
    components: {},
    computed: {
        testData: function() {
            return this.$root.$data.state.testData;
        },
    },
    watch: {
        'testData.pdemo': function(data) {
            if (data) {
                this.onShow();
            } else {
                this.onHide();
            }
        }
    },
    data: function() {
        return {}
    },
    mounted: function() {},
    methods: {}
}
</script>
<style>
</style>