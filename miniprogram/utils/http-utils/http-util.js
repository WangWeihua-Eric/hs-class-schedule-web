import {http} from "../wx-utils/wx-cloud-utils";

let singletonPattern = null;

export class HttpUtil {
    host = 'https://www.hongsong.club';

    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this;
    }

    post(url, param, sessionId= '') {
        if (sessionId) {
            param = {
                ...param,
                sessionId: sessionId
            }
        }
        return http(this.host + url, param, 'POST').then(res => {
            return res;
        })
    }

    get(url, param, sessionId = '') {
        if (sessionId) {
            param = {
                ...param,
                sessionId: sessionId
            }
        }
        return http(this.host + url, param, 'GET').then(res => {
            return res.result
        })
    }
}