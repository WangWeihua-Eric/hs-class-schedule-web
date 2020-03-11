// components/social/app-social.js
import {socilColorList} from "../../color-palette/social-color";
import {pageJump} from "../../utils/wx-utils/wx-base-utils";
import {isSessionReady} from "../../utils/user-utils/user-base-utils";
import {UserBase} from "../../utils/user-utils/user-base";
import {HttpUtil} from "../../utils/http-utils/http-util";

const userBase = new UserBase()
const http = new HttpUtil()

Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        socilColors: socilColorList,
        socialDataList: []
    },

    pageLifetimes: {
        show() {
            isSessionReady().then(res => {
                if (res) {
                    this.refresh()
                } else {
                    // 获取 sessionId 失败
                }
            })
        }
    },

    lifetimes: {
        // attached() {
        //     isSessionReady().then(res => {
        //         if (res) {
        //             this.refresh()
        //         } else {
        //             // 获取 sessionId 失败
        //         }
        //     })
        // }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        refresh() {
            const url = '/forum/api/querypost'
            http.get(url, {}, userBase.getGlobalData().sessionId).then(res => {
                if (res && res.state && res.state.code === '0') {
                    this.formatData(res.data)
                }
            })
        },
        onJump(event) {
            const index = event.currentTarget.dataset.value
            if (index > -1) {
                const bgColor = this.data.socilColors[index % 4]
                const code = this.data.socialDataList[index].code
                const url = `../../pages/social/social?bgColor=${bgColor}&postCode=${code}`
                pageJump(url).then(() => {}).catch(() => {})
            }
        },
        formatData(data) {
            data.forEach(item => {
                item.des = `已有 ${item.replyCnt} 人为老师点赞`
            })
            this.setData({
                socialDataList: data
            })
        }
    }
})
