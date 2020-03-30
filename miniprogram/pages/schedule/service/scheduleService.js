import {HttpUtil} from "../../../utils/http-utils/http-util";
import {UserBase} from "../../../utils/user-utils/user-base";
import {isSessionReady} from "../../../utils/user-utils/user-base-utils";

let singletonPattern = null;

export class ScheduleService {
    http = new HttpUtil()
    userBase = new UserBase()

    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this
    }

    testtt() {
        const url = '/vlog/api/authorization'

        return new Promise((resolve, reject) => {
            isSessionReady().then(res => {
                if (res) {
                    this.http.get(url, {}, this.userBase.getGlobalData().sessionId).then(res => {
                        if (res && res.state && res.state.code === '0') {
                            resolve(res.data)
                        } else {
                            reject(res)
                        }
                    }).catch((err) => {
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
     * 查询上周明星讲师
     */
    queryRankingWeek() {
        const url = '/forum/api/lastweektopk'

        return new Promise((resolve, reject) => {
            isSessionReady().then(res => {
                if (res) {
                    this.http.get(url, {}, this.userBase.getGlobalData().sessionId).then(res => {
                        if (res && res.state && res.state.code === '0') {
                            resolve(res.data)
                        } else {
                            reject(res)
                        }
                    }).catch((err) => {
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