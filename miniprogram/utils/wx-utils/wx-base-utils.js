/**
 * 查询是否授权
 * @param scope 授权内容
 */
export function getSetting(scope) {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (res) => {
                resolve(res.authSetting[scope])
            },
            fail: (error) => {
                reject(error)
            }
        })
    })
}

/**
 * 获取订阅授权
 */
export function getSettingWithSubscriptions() {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            withSubscriptions: true,
            success: res => {

                resolve(res)
                // res.authSetting = {
                //   "scope.userInfo": true,
                //   "scope.userLocation": true
                // }
                // res.subscriptionsSetting = {
                //   mainSwitch: true, // 订阅消息总开关
                //   itemSettings: {   // 每一项开关
                //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
                //     SYS_MSG_TYPE_RANK: 'accept'
                //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
                //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
                //   }
                // }
            },
            fail: error => {
                reject(error)
            }
        })

    })
}

/**
 * 获取微信缓存
 */
export function getStorage(key) {
    return new Promise((resolve, reject) => {
        wx.getStorage({
            key: key,
            success: (res) => {
                resolve(res.data)
            },
            fail: (error) => {
                reject(error)
            }
        })
    })
}

/**
 * 分享来源获取
 */
export function getShareInfo(shareTicket) {
    return new Promise((resolve, reject) => {
        wx.getShareInfo({
            shareTicket: shareTicket,
            success: (shareInfo) => {
                resolve(shareInfo)
            },
            fail: (error) => {
                reject(error)
            }
        })
    })
}

export function wxLogin() {
    return new Promise((resolve, reject) => {
        wx.login({
            success : res => {
                if (res.code) {
                    resolve(res)
                } else {
                    reject(res)
                }
            },
            fail: error => {
                reject(error)
            }
        })
    })
}

export function wxSubscribeMessage(tmplIds) {
    return new Promise((resolve, reject) => {
        wx.requestSubscribeMessage({
            tmplIds: tmplIds,
            success: res => {
                resolve(res)
            },
            fail: error => {
                reject(error)
            }
        })
    })
}