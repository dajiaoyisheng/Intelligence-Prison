export default {
    methods: {
        /** 加载监区树形 */
        loadTree: function() {
            this.$get(this.urlconfig.pmLoadTree).then(res => {
                if (res.status === 0) {
                    this.Prisonareatree = res.data;
                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                // todo something...
            });
        }
    }
}