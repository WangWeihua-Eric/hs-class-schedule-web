import {getSetting, getUserInfo} from "../../../../utils/wx-utils/wx-base-utils";
import {UserBase} from "../../../../utils/user-utils/user-base";
import {debounceForFunction} from "../../../../utils/time-utils/time-utils";

const userBase = new UserBase()

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
        },
        active: {
            type: Number,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        categoryList: ['推荐', '声乐乐器', '运动健身', '书法绘画','数码生活', '美妆丽人','健康生活', '外语','其他']
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onCardBookEvent(event) {
            this.triggerEvent('onBook', event.detail)
        },
        onChange(event) {
            const index = event.detail.index
            const params = {
                index: index
            }
            this.triggerEvent('changeTabEvent', params)
        },
        onJumpLook(event) {
            if (debounceForFunction()) {
                return
            }

            const value = event.currentTarget.dataset.value
            switch (value.linkto) {
                case 0: {
                    this.jumpOldLook(value)
                    break;
                }
                case 1: {
                    this.jumpNewLook(value)
                    break
                }
            }
        },
        jumpOldLook(value) {
            const path = value.miniPath
            wx.navigateToMiniProgram({
                appId: 'wxbe86c353682cdb84',
                path: path,
                success() {
                }
            })
        },
        jumpNewLook(value) {
            getSetting('scope.userInfo').then(res => {
                if (res) {
                    getUserInfo().then(userData => {
                        const userInfo = userData.userInfo
                        const userBaseInfo = userBase.getGlobalData()
                        const sessionId = userBaseInfo.sessionId
                        const userId = userBaseInfo.userId
                        const userName = userInfo.nickName
                        const userAvatar = userInfo.avatarUrl
                        const roomID = value.roomId
                        const roomName = value.title
                        const appid = userBase.getGlobalData().appid ? userBase.getGlobalData().appid : 'wx7854b9c2baa260f7'
                        const path = `pages/mlvb-live-room-demo/live-room-page/room?userId=${userId}&userName=${userName}&userAvatar=${userAvatar}&roomID=${roomID}&roomName=${roomName}&sessionId=${sessionId}`
                        wx.navigateToMiniProgram({
                            appId: appid,
                            path: path,
                            envVersion: 'trial',
                            success() {
                            }
                        })
                    })
                }
            })
        }
    }
})
