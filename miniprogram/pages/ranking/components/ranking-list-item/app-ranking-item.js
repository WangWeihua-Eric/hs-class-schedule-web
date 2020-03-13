// pages/ranking/components/ranking-list-item/app-ranking-item.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        index: {
            type: Number,
            value: -1
        },
        rankingItem: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        rankingLogo: [
            'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/ranking-no-1.png',
            'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/ranking-no-2.png',
            'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/ranking-no-3.png'
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {}
})
