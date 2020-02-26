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
            const url = '/auth/api/weixinlogin'
            const param = {
                appSign: 'hongsongkebiao',
                code: res.code
            }
            return http.post(url, param, 'login')
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
        if (res && res.result && res.result.state && res.result.state.code === '0') {
            const sessionId = res.result.data
            if (sessionId) {
                userBase.setGlobalData({sessionId: sessionId})
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
}

function checkSessionInfo(sessionInfo) {
    const nowTime = new Date().getTime()
    if (sessionInfo) {
        const updateTime = sessionInfo.updateTime
        const sessionId = sessionInfo.sessionId
        if (sessionId && updateTime && (nowTime - updateTime) < 6 * 60 * 60 * 1000) {
            userBase.setGlobalData({sessionId: sessionId})
        } else {
            setSessionId()
        }
    } else {
        setSessionId()
    }
}