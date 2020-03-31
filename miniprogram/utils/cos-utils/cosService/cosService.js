const COS = require('./cos-wx-sdk-v5');

let bucket = ''
let region = ''
let prefix = ''
let cosUpdateCode = ''
let cos = null
let singletonPattern = null;

export class CosService {
    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this
    }

    /**
     * 上传文件接口，文本信息转为 txt 上传
     * @param sessionId: String      鉴权
     * @param filePaths: String[]   文件路径
     * @param category: Number      类别
     * @param url: String           上传文件接口
     * @param bizcode: String       消息回复板块
     * @param scope: Number         目前不用关心
     * @param ext: Object           自定义扩展字段
     * @returns {Promise<unknown>}
     */
    uploadFiles(sessionId, filePaths, category, url, bizcode = 'dianping', scope = 0, ext = {}) {
        return new Promise((resolve, reject) => {
            if (!sessionId || !filePaths || !category || ! url) {
                reject('参数错误')
            }

            const params = {
                ...ext,
                sessionId: sessionId,
                bizcode: bizcode,
                scope: scope,
                category: category
            }
            httpRequest(url, params).then(cosInitInfo => {
                const res = cosInitInfo.credential
                cosUpdateCode = cosInitInfo.vlogCode

                bucket = res.bucket
                region = res.region
                prefix = res.prefix

                cos = new COS({
                    getAuthorization: function (options, callback) {
                        callback({
                            TmpSecretId: res.tmpSecretId,
                            TmpSecretKey: res.tmpSecretKey,
                            XCosSecurityToken: res.sessionToken,
                            StartTime: res.startTime,
                            ExpiredTime: res.expiredTime,
                        });
                    }
                });

                const allPromise = []

                filePaths.forEach((filePath, index) => {
                    const filename = `${index}.${filePath.substr(filePath.lastIndexOf('.') + 1)}`
                    const promiseItem = upLoadFile(filePath, filename)
                    allPromise.push(promiseItem)
                })

                Promise.all(allPromise).then(res => {
                    commitUpLoad(params, url, 1)
                    resolve(res)
                }).catch(err => {
                    commitUpLoad(params, url, 0)
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            })
        })
    }
}

function commitUpLoad(params, url, vsSatus) {
    const commitUrl = `${url}/callback`
    const sendParams = {
        ...params,
        code: cosUpdateCode,
        vsSatus: vsSatus
    }
    httpRequest(commitUrl, sendParams).then(() => {}).catch(() => {})
}

function upLoadFile(filePath, filename) {
    return new Promise((resolve, reject) => {
        cos.postObject({
            Bucket: bucket,
            Region: region,
            Key: prefix + filename,
            FilePath: filePath,
            onProgress: function (info) {
            }
        }, function (err, data) {
            if(err) {
                reject(err)
            } else {
                resolve(data)
            }
        });
    })
}

function httpRequest(url, params) {
    // 异步获取临时密钥
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: params,
            success: (result) => {
                if (result && result.data && result.data.state && result.data.state.code === "0") {
                    resolve(result.data.data)
                } else {
                    reject(result)
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}