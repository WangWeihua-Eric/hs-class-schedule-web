import {SocialService} from "../../service/socialService";
import {debounceForFunction} from "../../../../utils/time-utils/time-utils";
import {getOnlineFile, previewImage, readFile} from "../../../../utils/wx-utils/wx-base-utils";

const app = getApp()
const socialService = new SocialService()

Component({
    codeTemp: '',
    toUserId: '',

    /**
     * 组件的属性列表
     */
    properties: {
        showBottomLine: {
            type: Boolean,
            value: true
        },
        socialData: {
          type: Object,
          value: {}
        },
        postCode: {
            type: String,
            value: ''
        },
        bgColor: {
            type: String,
            value: ''
        },
    },

    observers: {
        "socialData": function (data) {
            const code = data.code
            if (this.codeTemp) {
                if (code !== this.codeTemp) {
                    this.codeTemp = code
                    this.refreshReplyData()
                    if(data.contentType === 3) {
                        this.refreshImgData()
                    }
                }
            } else {
                this.codeTemp = code
                this.refreshReplyData()
                if(data.contentType === 3) {
                    this.refreshImgData()
                }
            }
        }
    },

    lifetimes: {
        attached() {
            this.setData({
                sessionFrom: ''
            })
            if (app && app.globalData) {
                if (app.globalData.scene) {
                    this.setData({
                        sessionFrom: 'scenes=' + app.globalData.scene
                    })
                }
                if (app.globalData.query && app.globalData.query.from) {
                    this.setData({
                        sessionFrom: this.data.sessionFrom + '&from=' + app.globalData.query.from
                    })
                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        sessionFrom: '',
        serviceImgUrl: '../../../../../images/clickme.jpeg',
        replySheetShow: false,
        replyDataList: [],
        userSelectList: ['谢谢您，感谢支持！','您可以点击右下方「看视频」，查看详细课程！'],
        placeholder: '',
        txt: '',
        imgList: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onReplyEvent() {
            if (!(this.data.socialData.replyType === 2 || this.data.socialData.contentType === 3) || this.data.replySheetShow) {
                return
            }
            this.setData({
                replySheetShow: true
            })
        },

        OnReplyToUser(event) {
            const remarkName = event.currentTarget.dataset.value.remarkName
            const userId = event.currentTarget.dataset.value.remarkUserId;
            this.toUserId = userId;
            this.setData({
                placeholder: `回复${remarkName}：`,
                replySheetShow: true
            })
        },

        selectItem(event) {
            if (debounceForFunction()) {
                return;
            }

            const callInfo = event.currentTarget.dataset.value

            socialService.postRemark(this.data.socialData.code, this.toUserId, callInfo).then(() => {
                this.refreshReplyData()
                this.onCloseReplySheet()
            }).catch(() => {})
        },

        onConfirm(event) {
            if (debounceForFunction()) {
                return;
            }

            const callInfo = event.detail
            socialService.postRemark(this.data.socialData.code, this.toUserId, callInfo).then(() => {
                this.refreshReplyData()
                this.onCloseReplySheet()
            }).catch(() => {})
        },

        onCloseReplySheet() {
            this.toUserId = ''
            this.setData({
                replySheetShow: false,
                value: ''
            })
            setTimeout(() => {
                this.setData({
                    placeholder: ''
                })
            }, 200)
        },

        refreshReplyData() {
            this.setData({
                replyDataList: []
            })
            if (this.data.socialData && (this.data.socialData.replyType === 2 || this.data.socialData.replyType === 3)) {
                const code = this.data.socialData.code
                socialService.queryRemark(code).then(res => {
                    if (res[code]) {
                        this.setData({
                            replyDataList: res[code]
                        })
                    }
                }).catch(() => {})
            }
        },

        refreshImgData() {
            this.setData({
                txt: '',
                imgList: []
            })
            const extDataStr = this.data.socialData.extData
            if (extDataStr) {
                const extDataList = JSON.parse(extDataStr)
                this.formatImgData(extDataList)
            }
        },
        formatImgData(extDataList) {
            const prePath = this.data.socialData.content
            const imgList = []
            if (prePath && extDataList && extDataList.length) {
                extDataList.forEach(item => {
                    if (item.indexOf('txt') > -1) {
                        // 文本
                        this.toDownLoadTxt(prePath, item)
                    } else {
                        imgList.push(prePath + item)
                    }
                })
                this.setData({
                    imgList: imgList
                })
            }
        },
        toDownLoadTxt(prePath, fileName) {
            const fileUrl = prePath + fileName
            getOnlineFile(fileUrl).then(res => {
                const resFile = res.tempFilePath
                readFile(resFile).then(info => {
                    this.setData({
                        txt: info.data
                    })
                }).catch(() => {})
            }).catch(() => {

            })
        },

        onShowImg(event) {
            if(debounceForFunction()){
                return
            }
            const current = event.currentTarget.dataset.value
            previewImage(this.data.imgList, current).then(res => {
            }).catch(() => {
            })
        },

        nonp() {

        }
    }
})
