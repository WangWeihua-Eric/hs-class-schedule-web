import {HttpUtil} from "../utils/http-utils/http-util";
import {UserBase} from "../utils/user-utils/user-base";
import {isSessionReady} from "../utils/user-utils/user-base-utils";

let singletonPattern = null;

export class UserService {
    http = new HttpUtil()
    userBase = new UserBase()

    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this
    }


    /**
     * 更新用户信息
     */
    userUpdate(params) {
        const url = '/user/api/update'
        return new Promise((resolve, reject) => {
            isSessionReady().then(res => {
                if (res) {
                    this.http.post(url, params, this.userBase.getGlobalData().sessionId).then(res => {
                        if (res && res.result && res.result.state && res.result.state.code === '0') {
                            resolve(res.result.data)
                        } else {
                            reject(res.result)
                        }
                    }).catch(err => {
                        reject(err)
                    })
                } else {
                    // 获取 sessionId 失败
                    reject('获取 sessionId 失败')
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
}