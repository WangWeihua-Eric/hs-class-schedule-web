import {getSetting, getStorage, getUserInfo} from "../../utils/wx-utils/wx-base-utils";
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
import {UserBase} from "../../utils/user-utils/user-base";
import {HttpUtil} from "../../utils/http-utils/http-util";

const userBase = new UserBase()
const http = new HttpUtil()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        guide: false,
        scrollTop: null,
        active: 0,
        show: false,
        simpleUserModel: {},
        list: [
            {
                "text": "课表",
                "iconPath": "/images/schedule.png",
                "selectedIconPath": "/images/schedule-active.png"
            },
            {
                "text": "上课",
                "iconPath": "/images/in-class.png",
                "selectedIconPath": "/images/in-class-active.png"
            },
            {
                "text": "我",
                "iconPath": "/images/me.png",
                "selectedIconPath": "/images/me-active.png"
            }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    onPageScroll(event) {
        this.setData({
            scrollTop: event.scrollTop
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '红松课表',
            imageUrl: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/share.png',
            success: () => {
                wx.showShareMenu({
                    withShareTicket: true
                })
            }
        }
    },

    onToastEvent(event) {
        const type = event.detail.action
        switch (type) {
            case "load": {
                Toast.loading({
                    mask: true,
                    message: '加载中...',
                    duration: 0,
                });
                break
            }
            case "close": {
                Toast.clear()
                break
            }
        }
    },

    onDialogEvent(event) {
        const title = event.detail.title
        const message = event.detail.message
        Dialog.alert({
            title: title,
            message: message
        }).then(() => {
        });
    },

    onOverlayEvent() {
        this.setData({show: true});
    },

    closeOverlay() {
        this.setData({show: false});

        getStorage('first').then(() => {
            // 非首次登陆
        }).catch(() => {
            // 首次登陆
            this.setData({
                guide: true
            })
            setTimeout(() => {
                this.setData({
                    guide: false
                })
            }, 15000)
            wx.setStorage({
                key: 'first',
                data: true
            })
        })
    },

    tabChange(event) {
        const index = event.detail.index
        if (index === 2) {
            this.setSimpleUserModel()
            if (!userBase.getGlobalData().authed) {
                this.setData({show: true})
            }
        }
        switch (index) {
            case 0: {
                wx.setNavigationBarTitle({
                    title: '红松课表'
                })
                this.setData({active: index})
                break;
            }
            case 1: {
                const nowActive = this.data.active
                wx.setNavigationBarTitle({
                    title: '上课'
                })
                this.setData({
                    active: nowActive
                })
                break
            }
            case 2: {
                wx.setNavigationBarTitle({
                    title: '我'
                })
                this.setData({active: index})
                break
            }
        }
    },
    onClickHide() {
        // this.closeOverlay()
    },

    noop() {
    },

    onGetUserInfo() {
        getSetting('scope.userInfo').then(scopeRes => {
            if (scopeRes) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                getUserInfo().then(userInfo => {
                    // 获取用户信息成功
                    const user = userInfo.userInfo
                    const params = {
                        avatar: user.avatarUrl,
                        nickname: user.nickName
                    }
                    http.post('/user/api/update', params, userBase.getGlobalData().sessionId).then(res => {

                        if (res && res.result && res.result.state && res.result.state.code === '0') {
                            const user = {
                                ...res.result.data
                            }

                            userBase.setGlobalData(user)

                            wx.setStorage({
                                key: "sessionId",
                                data: {
                                    ...user,
                                    updateTime: new Date().getTime()
                                }
                            })
                        }

                        this.setSimpleUserModel()
                        this.closeOverlay()
                    }).catch(() => {
                        this.closeOverlay()
                    })
                })
            } else {
                // 拒绝
                this.setData({active: 0})
                this.closeOverlay()
            }
        })
    },
    setSimpleUserModel() {
        http.get('/user/api/query', {sessionId: userBase.getGlobalData().sessionId}).then(simpleUserModel => {
            if (simpleUserModel && simpleUserModel.state && simpleUserModel.state.code === '0') {
                this.setData({
                    simpleUserModel: this.formatTime(simpleUserModel.data)
                })
            }
        })
    },
    formatTime(simpleUserModel) {
        return {
            ...simpleUserModel,
            start: simpleUserModel.start.split(' ')[0]
        }
    }
})