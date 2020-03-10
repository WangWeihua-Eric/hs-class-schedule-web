import {isSessionReady} from "../../utils/user-utils/user-base-utils";
import {UserBase} from "../../utils/user-utils/user-base";
import {HttpUtil} from "../../utils/http-utils/http-util";
import {formatTime} from "../../utils/time-utils/time-utils";
import {getSetting, getStorage, getSystemInfo, getUserInfo} from "../../utils/wx-utils/wx-base-utils";

const userBase = new UserBase()
const http = new HttpUtil()

let timeHandler = false

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        bgColor: {
            type: String,
            value: ''
        },
        postCode: {
            type: String,
            value: ''
        },
        socialList: {
            type: Array,
            value: []
        },
        scopeRes: {
            type: Boolean,
            value: false
        },
        socialData: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showList: true,
        tipShow: false
    },

    lifetimes: {
        attached() {
            getStorage('tipShow').then(() => {}).catch(() => {
                this.setData({
                    tipShow: true
                })
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClickShow() {


            if (timeHandler) {
                return
            }
            setTimeout(() => {
                timeHandler = false
            }, 1000)
            timeHandler = true



            wx.showModal({
                content: '每天只有两次点赞的机会哦！是否要投上你神圣的一票，对ta说声谢谢呢？',
                cancelText: '我再想想',
                confirmText: '感谢老师',
                confirmColor: this.data.bgColor,
                success: res => {
                    if (res.confirm) {
                        this.hiddenTip()
                        if (!this.data.scopeRes) {
                            getSetting('scope.userInfo').then(scopeRes => {
                                if (scopeRes) {
                                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                                    getUserInfo().then(userInfo => {
                                        // 获取用户信息成功
                                        const user = userInfo.userInfo
                                        const userImgUrl = user.avatarUrl
                                        const nickname = user.nickName
                                        const param = {
                                            userImgUrl: userImgUrl,
                                            nickname: nickname
                                        }

                                        http.post('/user/api/update', {
                                            avatar: userImgUrl,
                                            nickname: nickname
                                        }, userBase.getGlobalData().sessionId).then(res => {

                                            if (res && res.result && res.result.state && res.result.state.code === '0') {


                                                const user = {
                                                    ...res.result.data
                                                }

                                                userBase.setGlobalData(user)



                                                const url = '/forum/api/postreply'
                                                const params = {
                                                    postCode: this.data.postCode,
                                                    contentType: 0
                                                }


                                                http.post(url, params, userBase.getGlobalData().sessionId).then(res => {
                                                    if (res && res.result && res.result.state && res.result.state.code === '0') {
                                                        this.triggerEvent('overlayShowEventWithInfo', param)
                                                        this.refresh(this.data.postCode)
                                                    } else if (res && res.result && res.result.state && res.result.state.code === '60001') {
                                                        wx.showModal({
                                                            content: '每天只能点赞两次哦',
                                                            showCancel: false
                                                        })
                                                    }
                                                })

                                                wx.setStorage({
                                                    key: "sessionId",
                                                    data: {
                                                        ...user,
                                                        updateTime: new Date().getTime()
                                                    }
                                                })
                                            }

                                        })
                                    })
                                } else {
                                    wx.showModal({
                                        content: '请同意授权用户信息',
                                        showCancel: false
                                    })
                                }
                            })
                        } else {
                            const url = '/forum/api/postreply'
                            const params = {
                                postCode: this.data.postCode,
                                contentType: 0
                            }
                            http.post(url, params, userBase.getGlobalData().sessionId).then(res => {
                                if (res && res.result && res.result.state && res.result.state.code === '0') {
                                    this.triggerEvent('overlayShowEvent')
                                    this.refresh(this.data.postCode)
                                } else if (res && res.result && res.result.state && res.result.state.code === '60001') {
                                    wx.showModal({
                                        content: '每天只能点赞两次哦',
                                        showCancel: false
                                    })
                                }
                            })
                        }
                    }
                }
            })
        },
        refresh(postCode) {
            this.triggerEvent('updateList')
        },
        formatData(data) {
            data.forEach(item => {
                const time = item.time
                item.createTime = formatTime(time)
                item.userImg = item.authorAvatar
                item.userName = item.authorName
                item.callNumber = `已点赞 ${item.cnt} 次`
                item.callDes = item.content
            })
            this.setData({
                socialList: data
            })
        },
        jumpvlog() {
            this.hiddenTip()
            let path = ''
            if (this.data.socialData.authorVlog) {
                path = this.data.socialData.authorVlog
            }

            wx.navigateToMiniProgram({
                appId: 'wxbe86c353682cdb84',
                path: path,
                success() {}
            })
        },
        hiddenTip() {
            this.setData({
                tipShow: false
            })
            wx.setStorage({
                key:"tipShow",
                data: true
            })
        }
    }
})
