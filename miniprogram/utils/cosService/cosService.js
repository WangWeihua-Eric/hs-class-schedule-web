import {ScheduleService} from "../../pages/schedule/service/scheduleService";

const COS = require('./cos-wx-sdk-v5');
const stsUrl = '/vlog/api/authorization'
const scheduleService = new ScheduleService()

let bucket = ''
let region = ''
let prefix = ''

// 签名回调
const getAuthorizationInit = function(options, callback) {
    console.log(111122)


    scheduleService.testtt().then(res => {
        console.log(res)
        bucket = res.bucket
        region = res.region
        prefix = res.prefix

        callback({
            TmpSecretId: res.tmpSecretId,
            TmpSecretKey: res.tmpSecretKey,
            XCosSecurityToken: res.sessionToken,
            StartTime: res.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
            ExpiredTime: res.expiredTime, // 时间戳，单位秒，如：1580000900
        });
    })

    // 格式一、（推荐）后端通过获取临时密钥给到前端，前端计算签名
    // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
    // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
    // wx.request({
    //     method: 'GET',
    //     url: stsUrl, // 服务端签名，参考 server 目录下的两个签名例子
    //     dataType: 'json',
    //     success: function(result) {
    //         var data = result.data;
    //         var credentials = data && data.credentials;
    //         if (!data || !credentials) return console.error('credentials invalid');
    //         callback({
    //             TmpSecretId: credentials.tmpSecretId,
    //             TmpSecretKey: credentials.tmpSecretKey,
    //             XCosSecurityToken: credentials.sessionToken,
    //             StartTime: data.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
    //             ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
    //         });
    //     }
    // });
}

let singletonPattern = null;

export class CosService {
    cos = null
    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this
    }

    /**
     * 上传文件接口，文本信息转为 txt 上传
     * @param filePaths: String[]
     */
    uploadFiles(filePaths) {

        scheduleService.testtt().then(res => {
            console.log(res)
            bucket = res.bucket
            region = res.region
            prefix = res.prefix

            this.cos = new COS({
                // path style 指正式请求时，Bucket 是在 path 里，这样用途相同园区多个 bucket 只需要配置一个园区域名
                // ForcePathStyle: true,
                getAuthorization: function (options, callback) {
                    callback({
                        TmpSecretId: res.tmpSecretId,
                        TmpSecretKey: res.tmpSecretKey,
                        XCosSecurityToken: res.sessionToken,
                        StartTime: res.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                        ExpiredTime: res.expiredTime, // 时间戳，单位秒，如：1580000900
                    });
                }
            });

            const filePath = filePaths[0];
            const filename = filePath.substr(filePath.lastIndexOf('/') + 1);

            console.log(bucket)

            this.cos.postObject({
                Bucket: bucket,
                Region: region,
                Key: prefix + filename,
                FilePath: filePath,
                onProgress: function (info) {
                    console.log('1111： ', JSON.stringify(info));
                }
            }, function (err, data) {
                console.log(err || data);
            });

        })
    }

    /**
     * 查询消息
     * @param bucketFilePath: String
     */
    queryMessage(bucketFilePath) {

    }
}