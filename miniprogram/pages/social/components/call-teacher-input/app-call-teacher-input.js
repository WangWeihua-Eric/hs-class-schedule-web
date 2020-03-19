import {debounceForFunction} from "../../../../utils/time-utils/time-utils";
import {getSetting, getUserInfo} from "../../../../utils/wx-utils/wx-base-utils";
import {UserService} from "../../../../service/userService";
import {UserBase} from "../../../../utils/user-utils/user-base";
import {FansService} from "../../../../service/fansService";

const userService = new UserService()
const userBase = new UserBase()
const fansService = new FansService()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        userSelectList: {
            type: Array,
            value: []
        },
        bgColor: {
            type: String,
            value: ''
        },
        scopeRes: {
            type: Boolean,
            value: false
        },
        postCode: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        value: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onConfirm(event) {
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
                        const callInfo = event.detail
                        this.callTeacher(callInfo)
                    }
                }
            })
        },
        selectItem(event) {
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
                        const callInfo = event.currentTarget.dataset.value
                        this.callTeacher(callInfo)
                    }
                }
            })
        },
        callTeacher(content = '') {
            let params = {
                postCode: this.data.postCode,
                contentType: 0
            }

            if (content) {
                params = {
                    ...params,
                    contentType: 1,
                    content: content
                }
            }


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
                                fansService.callTeacher(params).then(() => {
                                    this.setData({
                                        value: ''
                                    })
                                    this.triggerEvent('overlayShowEventWithInfo', param)
                                }).catch(err => {
                                    if (err && err.state && err.state.code === '60001') {
                                        wx.showModal({
                                            content: '每天只能点赞两次哦',
                                            showCancel: false
                                        })
                                        this.triggerEvent('callErrorEvent')
                                    } else {
                                        wx.showModal({
                                            content: '点赞失败，请重试',
                                            showCancel: false
                                        })
                                        this.triggerEvent('callErrorEvent')
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
                                this.triggerEvent('callErrorEvent')
                            })
                        })
                    } else {
                        wx.showModal({
                            content: '请同意授权用户信息',
                            showCancel: false
                        })
                        this.triggerEvent('callErrorEvent')
                    }
                }).catch(() => {
                    wx.showModal({
                        content: '请同意授权用户信息',
                        showCancel: false
                    })
                    this.triggerEvent('callErrorEvent')
                })
            } else {
                fansService.callTeacher(params).then(() => {
                    this.setData({
                        value: ''
                    })
                    this.triggerEvent('overlayShowEvent')
                }).catch(err => {
                    if (err && err.state && err.state.code === '60001') {
                        wx.showModal({
                            content: '每天只能点赞两次哦',
                            showCancel: false
                        })
                        this.triggerEvent('callErrorEvent')
                    } else {
                        wx.showModal({
                            content: '点赞失败，请重试',
                            showCancel: false
                        })
                        this.triggerEvent('callErrorEvent')
                    }
                })
            }
        }
    }
})
