// pages/social/components/teacher-card/app-teacher-card.js
import {pageJump} from "../../../../utils/wx-utils/wx-base-utils";

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
        fansList: {
            type: Array,
            value: []
        },
        postCode: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onJumpRanking() {
            const url = `../../../../ranking/ranking?bgColor=${this.data.bgColor}&postCode=${this.data.postCode}`
            pageJump(url).then(() => {}).catch(() => {})
        }
    }
})
