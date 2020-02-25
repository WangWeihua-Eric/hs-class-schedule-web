import {wxLogin} from "../wx-utils/wx-base-utils";
import {HttpUtil} from "../http-utils/http-util";

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
            return http.post(url, param)
        }
    })
}