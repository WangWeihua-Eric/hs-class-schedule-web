import {SocialService} from "../../service/socialService";
import {debounceForFunction} from "../../../../utils/time-utils/time-utils";

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
                }
            } else {
                this.codeTemp = code
                this.refreshReplyData()
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
        placeholder: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onReplyEvent() {
            if (this.data.socialData.replyType !== 2 || this.data.replySheetShow) {
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
            if (this.data.socialData && this.data.socialData.replyType === 2) {
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

        nonp() {

        }
    }
})
