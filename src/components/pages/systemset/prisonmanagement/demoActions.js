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
        },
        loadPicByAreaID(areaId){
          let _this = this;
          //TODO: 加载平面图
          this.$get("/getAreaPicByID")
            .then(res => {
              if (res.status === 0) {
                _this.drawObj.setBackgroundPicture();

              }
            })
            .catch(function(error) {
              console.log(error);
            })
            .then(function() {});
        }
    }
}
