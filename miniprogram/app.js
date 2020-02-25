//app.js
import {getStorage, wxLogin} from "./utils/wx-utils/wx-base-utils";
import {getSessionId} from "./utils/user-utils/user-base-utils";

App({
    onLaunch: function () {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                env: 'hs-class-schedule-we-8wofx',
                traceUser: true,
            })
        }

        this.globalData = {}

        getStorage('sessionId').then(sessionInfo => {
            this.checkSessionInfo(sessionInfo)
        }).catch(error => {
            this.setSessionId()
        })
    },
    setSessionId() {
        getSessionId().then(res => {
            if (res && res.result && res.result.state && res.result.state.code === '0') {
                const sessionId = res.result.data
                if (sessionId) {
                    this.globalData.sessionId = sessionId
                    wx.setStorage({
                        key:"sessionId",
                        data: {
                            sessionId: sessionId,
                            updateTime: new Date().getTime()
                        }
                    })

                }
            }
        })
    },
    checkSessionInfo(sessionInfo) {
        console.log('sessionId: ', sessionInfo)
        const nowTime = new Date().getTime()
        if (sessionInfo) {
            const updateTime = sessionInfo.updateTime
            const sessionId = sessionInfo.sessionId
            if (sessionId && updateTime && (nowTime - updateTime) < 6 * 60 * 60 * 1000) {
                this.globalData.sessionId = sessionInfo.sessionId
            } else {
                this.setSessionId()
            }
        } else {
            this.setSessionId()
        }
    }
})
