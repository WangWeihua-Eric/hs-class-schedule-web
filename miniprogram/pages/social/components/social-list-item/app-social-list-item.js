const app = getApp()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        showBottomLine: {
            type: Boolean,
            value: true
        },
        socialData: {
          type: Object,
          value: {}
        },
        postCode: {
            type: String,
            value: ''
        },
        bgColor: {
            type: String,
            value: ''
        },
    },

    lifetimes: {
        attached() {
            this.setData({
                sessionFrom: ''
            })
            if (app && app.globalData) {
                if (app.globalData.scene) {
                    this.setData({
                        sessionFrom: 'scenes=' + app.globalData.scene
                    })
                }
                if (app.globalData.query && app.globalData.query.from) {
                    this.setData({
                        sessionFrom: this.data.sessionFrom + '&from=' + app.globalData.query.from
                    })
                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        sessionFrom: '',
        serviceImgUrl: '../../../../../images/clickme.jpeg',
    },

    /**
     * 组件的方法列表
     */
    methods: {}
})
