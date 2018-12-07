export default {
    methods: {
        loadTree() {
            // 加载监狱树
            this.$get("/getPrisonareatree")
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