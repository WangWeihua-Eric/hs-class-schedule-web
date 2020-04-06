import {HttpUtil} from "../../../utils/http-utils/http-util";
import {UserBase} from "../../../utils/user-utils/user-base";
import {isSessionReady} from "../../../utils/user-utils/user-base-utils";
import {formatTime} from "../../../utils/time-utils/time-utils";

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

    /**
     * 获取轮播
     */
    queryRecently() {
        const url = '/course/api/query/recently'
        const params = {}
        return this.http.newGet(url, params).then(res => {
            this.formatSwiper(res)
            return res
        })
    }

    /**
     * 按类别获取课表
     */
    queryCategory(category = 0, seqno = '0') {
        const url = '/course/api/query/category'
        const params = {
            category: category,
            seqno: seqno
        }
        return this.http.newGet(url, params)
    }

    formatSwiper(data) {
        data.sort((a, b) => {
            let value1 = a['start']
            let value2 = b['start']
            return value1 - value2
        })
        data.forEach(item => {
            item.openTime = `${formatTime(item.start)} 开始`
        })
    }
}