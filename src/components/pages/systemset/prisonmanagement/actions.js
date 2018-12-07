export default {
    methods: {
        loadTree() {
            // 加载监狱树
            this.$get("/prisonRegion.action?method=getPrisonRegionTree")
                .then(res => {
                    if (res.status === 0) {
                        this.Prisonareatree = res.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                })
                .then(function() {});
        }
    }
}