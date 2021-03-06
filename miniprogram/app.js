//app.js
import {initSessionId} from "./utils/user-utils/user-base-utils";
import {getSystemInfo} from "./utils/wx-utils/wx-base-utils";

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
        initSessionId()
    },
    onShow: function (res) {
        this.globalData.query = res.query
        this.globalData.scene = res.scene
        this.globalData.path = res.path
        getSystemInfo().then(res => {
            if (res && res.windowHeight) {
                this.globalData.windowHeight = res.windowHeight
            }
        })
    }
})
