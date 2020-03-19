import {HttpUtil} from "../../../utils/http-utils/http-util";
import {UserBase} from "../../../utils/user-utils/user-base";
import {isSessionReady} from "../../../utils/user-utils/user-base-utils";

let singletonPattern = null;

export class SocialService {
    http = new HttpUtil()
    userBase = new UserBase()

    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this
    }

    /**
     * 通过 postCode 获取详情
     */
    queryInfoByCode(postCode) {
        const url = '/forum/api/querypostbycode'
        const params = {
            postCode: postCode
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
     * 获取 SocialList
     */
    querySocialList(postCode, loadType = 0, seqno = 0, replyType = 0) {
        const url = '/forum/api/queryreply'
        const params = {
            postCode: postCode,
            loadType: loadType,
            seqno: seqno,
            replyType: replyType
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
     * 关系链绑定
     */
    invited(uid, postCode) {
        const url = '/user/api/invited'
        const params = {
            postCode: postCode,
            rtype: 0,
            uid: uid
        }

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

    /**
     * 分享埋点
     */
    recordAction() {
        const url = '/user/api/action'
        const params = {
            acNo: 'sr1'
        }
        isSessionReady().then(res => {
            if (res) {
                this.http.post(url, params, this.userBase.getGlobalData().sessionId).then(() => {}).catch(() => {})
            }
        }).catch(() => {})
    }

    /**
     * 回复提问
     */
    postRemark(replyCode, toUserId, content) {
        const url = '/forum/api/postremark'

        const params = {
            replyCode: replyCode,
            toUserId: toUserId,
            content: content
        }

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

    /**
     * 查询回复
     */
    queryRemark(codes) {
        const url = '/forum/api/queryremark'

        const params = {
            codes: codes
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
}