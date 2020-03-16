import {UserBase} from "../../../../utils/user-utils/user-base";
import {debounceForFunction, formatTime} from "../../../../utils/time-utils/time-utils";
import {getSetting, getStorage, getUserInfo} from "../../../../utils/wx-utils/wx-base-utils";
import {SocialService} from "../../service/socialService";
import {UserService} from "../../../../service/userService";
import {getWithWhere} from "../../../../utils/wx-utils/wx-db-utils";

const socialService = new SocialService()
const userService = new UserService()

const userBase = new UserBase()

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
        showCallGurid: false,
        tipShow: false,
        joininShow: false,
        tipData: {}
    },

    lifetimes: {
        attached() {
            getWithWhere('inReview', {
                position: 'socialInfo'
            }).then(socialInfoList => {
                if (socialInfoList.length) {
                    const socialInfo = socialInfoList[0]
                    const tipData = {
                        userImg: socialInfo.userImg,
                        userName: socialInfo.userName,
                        createTime: socialInfo.createTime,
                        callDes: socialInfo.callDes
                    }

                    this.setData({
                        tipData: tipData,
                        joininShow: socialInfo.show
                    });
                }
            })
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
            if (debounceForFunction()) {
                return;
            }

            wx.showModal({
                content: '每天只有两次点赞的机会哦！是否要投上您神圣的一票，对ta说声谢谢呢？',
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

                                        userService.userUpdate({
                                            avatar: userImgUrl,
                                            nickname: nickname
                                        }).then(res => {
                                            const user = {
                                                ...res
                                            }
                                            userBase.setGlobalData(user)
                                            socialService.callTeacher(this.data.postCode).then(() => {
                                                this.triggerEvent('overlayShowEventWithInfo', param)
                                            }).catch(err => {
                                                if (err && err.state && err.state.code === '60001') {
                                                    this.setData({
                                                        showCallGurid: true
                                                    })
                                                    wx.showModal({
                                                        content: '每天只能点赞两次哦',
                                                        showCancel: false
                                                    })
                                                } else {
                                                    wx.showModal({
                                                        content: '点赞失败，请重试',
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
                                        }).catch(() => {
                                            wx.showModal({
                                                content: '点赞失败，请重试',
                                                showCancel: false
                                            })
                                        })
                                    })
                                } else {
                                    wx.showModal({
                                        content: '请同意授权用户信息',
                                        showCancel: false
                                    })
                                }
                            }).catch(() => {
                                wx.showModal({
                                    content: '请同意授权用户信息',
                                    showCancel: false
                                })
                            })
                        } else {
                            socialService.callTeacher(this.data.postCode).then(() => {
                                this.triggerEvent('overlayShowEvent')
                            }).catch(err => {
                                if (err && err.state && err.state.code === '60001') {
                                    this.setData({
                                        showCallGurid: true
                                    })
                                    wx.showModal({
                                        content: '每天只能点赞两次哦',
                                        showCancel: false
                                    })
                                } else {
                                    wx.showModal({
                                        content: '点赞失败，请重试',
                                        showCancel: false
                                    })
                                }
                            })
                        }
                    }
                }
            })
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
