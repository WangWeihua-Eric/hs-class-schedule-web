import {HttpUtil} from "../../http-utils/http-util";
import {UserBase} from "../../user-utils/user-base";

let singletonPattern = null;

export class CosCloudService {
    http = new HttpUtil()
    userBase = new UserBase()

    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this
    }

    /**
     * 获取 token
     */
    getToken(url, params) {
        return new Promise((resolve, reject) => {
            this.http.get(url, params).then(res => {
                if (res && res.state && res.state.code === '0') {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 回调提交
     */
    commitUpLoad(url, params) {
        return new Promise((resolve, reject) => {
            this.http.post(url, params).then(res => {
                if (res && res.result && res.result.state && res.result.state.code === '0') {
                    resolve(res.result.data)
                } else {
                    reject(res.result)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
}