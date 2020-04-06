import {http} from "../wx-utils/wx-cloud-utils";
import {isSessionReady} from "../user-utils/user-base-utils";
import {UserBase} from "../user-utils/user-base";

let singletonPattern = null;

export class HttpUtil {
    userBase = new UserBase()

    host = 'https://www.hongsong.club'

    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this


        let environment = 'prod'
        if (typeof __wxConfig === "object") {
            let version = __wxConfig.envVersion
            switch (version) {
                case 'develop': {
                    //  工具或者真机 开发环境
                    environment = 'dev'
                    break
                }
                case 'trial': {
                    //  测试环境(体验版)
                    environment = 'beta'
                    break
                }
                case 'release': {
                    //  正式环境
                    environment = 'prod'
                    break
                }
                default: {
                    //  默认环境
                    environment = 'prod'
                }
            }
        }
        switch (environment) {
            case 'dev': {
                this.host = 'https://dev.hongsong.club'
                break
            }
            case 'beta': {
                this.host = 'https://dev.hongsong.club'
                break
            }
            case 'prod': {
                this.host = 'https://www.hongsong.club'
                break
            }
            default: {
                this.host = 'https://www.hongsong.club'
            }
        }
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
            //  调试开课弹窗用 不删
            // if (url === '/course/api/schedules') {
            //     res.result.data[5].courses[0].finishTime = 'PM 22:00'
            //     res.result.data[5].courses[1].finishTime = 'PM 22:00'
            // }
            return res.result
        })
    }

    newGet(url, params) {
        return new Promise((resolve, reject) => {
            isSessionReady().then(res => {
                if (res) {
                    this.get(url, params, this.userBase.getGlobalData().sessionId).then(res => {
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