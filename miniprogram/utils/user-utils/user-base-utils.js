import {getStorage, wxLogin} from "../wx-utils/wx-base-utils";
import {HttpUtil} from "../http-utils/http-util";
import {UserBase} from "./user-base";

const userBase = new UserBase()

/**
 * 获取 sessionId
 */
export function getSessionId() {
    const http = new HttpUtil()
    return wxLogin().then(res => {
        if (res.code) {
            const url = '/auth/api/wechatlogin'
            const param = {
                appSign: 'hongsongkebiao',
                code: res.code
            }
            return http.post(url, param, 'login')
        }
    })
}

export function isSessionReady() {
    return new Promise((resolve, reject) => {
        if (userBase.getGlobalData().sessionId) {
            //  成功获取 sessionId
            resolve(true)
        } else {
            setTimeout(() => {
                isSessionReady().then(res => {
                    resolve(res)
                })
            }, 100)
        }
    })
}

export function initSessionId() {
    getStorage('sessionId').then(sessionInfo => {
        checkSessionInfo(sessionInfo)
    }).catch(error => {
        setSessionId()
    })
}

function setSessionId() {
    getSessionId().then(res => {
        if (res && res.result && res.result.state && res.result.state.code === '0' && res.result.data) {
            const sessionId = res.result.data.sessionId
            if (sessionId) {
                userBase.setGlobalData(res.result.data)
                wx.setStorage({
                    key:"sessionId",
                    data: {
                        ...res.result.data,
                        updateTime: new Date().getTime()
                    }
                })

            }
        }
    })
}

function checkSessionInfo(sessionInfo) {
    const nowTime = new Date().getTime()
    if (sessionInfo) {
        const updateTime = sessionInfo.updateTime
        const sessionId = sessionInfo.sessionId
        const authed = sessionInfo.authed
        const userId = sessionInfo.userId
        if (sessionId && updateTime && (nowTime - updateTime) < 6 * 60 * 60 * 1000) {
            userBase.setGlobalData({sessionId: sessionId, authed: authed, userId: userId})
        } else {
            setSessionId()
        }
    } else {
        setSessionId()
    }
}