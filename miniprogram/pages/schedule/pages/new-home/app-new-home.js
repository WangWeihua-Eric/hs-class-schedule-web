// pages/schedule/pages/new-home/app-new-home.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        swiperList: {
            type: Array,
            value: []
        },
        roomList: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        active: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event) {
            wx.showToast({
                title: `切换到标签 ${event.detail.name}`,
                icon: 'none'
            });
        }
    }
})
