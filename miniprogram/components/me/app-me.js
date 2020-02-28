// components/me/app-me.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        show: false
    },

    pageLifetimes: {
        show: function () {
            this.setData({show: true});
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClickHide() {
            this.setData({show: false});
        },

        noop() {
        }
    }
})
