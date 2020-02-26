import {getSessionId} from "../user-utils/user-base-utils";
import {UserBase} from "../user-utils/user-base";

export function login() {
    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                resolve(res)
            },
            fail: error => {
                reject(error)
            }
        })
    })
}

export function http(url, param, method, header = {'content-type': 'application/x-www-form-urlencoded'}) {
    param = {
        ...param,
        appSign: 'hongsongkebiao'
    }
    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            name: 'http',
            data: {
                url: url,
                param: param,
                method: method,
                header: header
            },
            success: res => {
                if (res && res.result && res.result.state && res.result.state.code === '401') {
                    getSessionId().then(sessionInfo => {
                        if (sessionInfo && sessionInfo.result && sessionInfo.result.state && sessionInfo.result.state.code === '0') {
                            const sessionId = sessionInfo.result.data
                            if (sessionId) {
                                wx.cloud.callFunction({
                                    name: 'http',
                                    data: {
                                        url: url,
                                        param: {
                                            ...param,
                                            sessionId: sessionId
                                        },
                                        method: method,
                                        header: header
                                    },
                                    success: again => {
                                        resolve(again)
                                    },
                                    fail: againError => {
                                        reject(againError)
                                    }
                                })
                                const userBase = new UserBase()
                                userBase.setGlobalData({sessionId: sessionId})
                                wx.setStorage({
                                    key:"sessionId",
                                    data: {
                                        sessionId: sessionId,
                                        updateTime: new Date().getTime()
                                    }
                                })

                            } else {
                                reject(sessionInfo.result.state)
                            }
                        }
                    })
                } else {
                    resolve(res)
                }
            },
            fail: error => {
                reject(error)
            }
        })
    })
}