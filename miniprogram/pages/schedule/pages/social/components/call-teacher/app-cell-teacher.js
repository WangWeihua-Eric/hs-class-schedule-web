Component({
    /**
     * 组件的属性列表
     */
    properties: {
        bgColor: {
            type: String,
            value: ''
        },
        socialData: {
            type: Object,
            value: {}
        },
        arrow: {
            type: Boolean,
            value: false
        },
        index: {
            type: Number,
            value: -1
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        rankImgList: [
            'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/no-1.png',
            'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/no-2.png',
            'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/no-3.png'
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {}
})
