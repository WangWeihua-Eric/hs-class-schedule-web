import {UserBase} from "../../../../../../utils/user-utils/user-base";
import {debounceForFunction} from "../../../../../../utils/time-utils/time-utils";

const userBase = new UserBase()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        swiperList: {
            type: Array,
            value: []
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
        onBookEvent(event) {
            console.log(event)
            const bookInfo = event.currentTarget.dataset.value
            this.triggerEvent('cardBookEvent', bookInfo)
        },
        onJumpMini(event) {
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
            const roomID = value.roomId
            const roomName = value.title
            const appid = userBase.getGlobalData().appid ? userBase.getGlobalData().appid : 'wx7854b9c2baa260f7'
            const path = `pages/mlvb-live-room-demo/live-room-page/room?roomID=${roomID}&roomName=${roomName}`
            wx.navigateToMiniProgram({
                appId: appid,
                path: path,
                envVersion: 'trial',
                success() {
                }
            })
        }
    }
})
