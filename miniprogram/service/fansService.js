import {HttpUtil} from "../utils/http-utils/http-util";
import {UserBase} from "../utils/user-utils/user-base";
import {isSessionReady} from "../utils/user-utils/user-base-utils";

let singletonPattern = null;

export class FansService {
    http = new HttpUtil()
    userBase = new UserBase()

    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this
    }

    /**
     * 获取铁粉
     */
    queryFans(postCode, limit = 3) {
        const url = '/forum/api/queryfans'
        const params = {
            postCode: postCode,
            limit: limit
        }

        return new Promise((resolve, reject) => {
            isSessionReady().then(res => {
                if (res) {
                    this.http.get(url, params, this.userBase.getGlobalData().sessionId).then(res => {
                        if (res && res.state && res.state.code === '0') {
                            resolve(res.data)
                        } else {
                            reject(res)
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

    /**
     * 给老师点赞
     */
    callTeacher(params) {
        const url = '/forum/api/postreply'

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