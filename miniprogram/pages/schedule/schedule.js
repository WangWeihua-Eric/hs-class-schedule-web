import {getSetting, getStorage, getUserInfo} from "../../utils/wx-utils/wx-base-utils";
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
import {UserBase} from "../../utils/user-utils/user-base";
import {HttpUtil} from "../../utils/http-utils/http-util";
import {getWithWhere} from "../../utils/wx-utils/wx-db-utils";
import {ScheduleService} from "./service/scheduleService";
import {debounceForFunction} from "../../utils/time-utils/time-utils";

const userBase = new UserBase()
const http = new HttpUtil()
const app = getApp()
const scheduleService = new ScheduleService()

let lessonDialogFirstTime = null
let lessonDialogNumber = 0
let category = 0
let lesson = {}
let addLoding = false
let healthLoding = false
let activeTmp = -1

Page({
    /**
     * 页面的初始数据
     */
    data: {
        rankDialogInfo: {},
        showRank: false,
        guide: false,
        scrollTop: null,
        active: -1,
        tabActive: 0,
        show: false,
        showSheet: false,
        showOpenLesson: false,
        simpleUserModel: {},
        openLesson: [],
        welcomeBgHeight: 555,
        sessionFrom: 'type=course',
        serviceImgUrl: '../../images/clickme.jpeg',
        showLoak: false,
        btnTitle: '',
        img: '',
        title: '',
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
                "text": "连线调理",
                "iconPath": "/images/health-link.png",
                "selectedIconPath": "/images/health-link-active.png"
            },
            {
                "text": "讨论组",
                "iconPath": "/images/thx.png",
                "selectedIconPath": "/images/thx-active.png"
            },
            {
                "text": "我",
                "iconPath": "/images/me.png",
                "selectedIconPath": "/images/me-active.png"
            }
        ],
        from: '',
        swiperList: [],
        roomList: [],
        nowCategory: 0,
        bookInfo: {},
        healthList: []
    },

    refresh() {
        const index = this.data.active
        switch (index) {
            case -1: {
                this.setData({
                    nowCategory: category
                })
                this.refreshHome()
                break
            }
            case 2: {
                this.refreshHealth()
                break
            }
            case 3: {
                break
            }
        }
    },

    /**
     * 刷新首页
     */
    refreshHome() {
        this.refreshSwiper()
        this.refreshLessonList()
    },

    /**
     * 刷新健康首页
     */
    refreshHealth() {
        scheduleService.queryCategory(100).then(res => {
            this.setData({
                healthList: res
            })
            healthLoding = false
        }).catch(() => {
            healthLoding = false
        })
    },

    /**
     * 刷新首页轮播
     */
    refreshSwiper() {
        scheduleService.queryRecently().then(res => {
            this.setData({
                swiperList: res
            })
        }).catch(() => {})
    },

    /**
     * 刷新课表种类
     */
    refreshLessonList() {
        scheduleService.queryCategory(category).then(res => {
            lesson[category] = res
            this.setData({
                roomList: res
            })
            addLoding = false
        }).catch(() => {
            addLoding = false
        })
    },

    /**
     * 加载课种类
     */
    addRoomList(seqno) {
        scheduleService.queryCategory(category, seqno).then(res => {
            const list = [...this.data.roomList, ...res]
            lesson[category] = list
            this.setData({
                roomList: list
            })
            addLoding = false
        }).catch(() => {
            addLoding = false
        })
    },

    onSwitchActive() {
        const index = this.data.active
        switch (index) {
            case -1: {
                activeTmp = 0
                this.setData({
                    active: 0
                })
                break;
            }
            case 0: {
                activeTmp = -1
                this.setData({
                    active: -1
                })
                break;
            }
        }
    },

    onBookEvent(event) {
        this.setData({
            bookInfo: event.detail
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const active = options.active
        if (active > 0) {
            const index = parseInt(active)
            this.setNavTitle(index)
            this.setData({
                active: index,
                tabActive: index
            })
        }

        const from = options.from

        if (from) {
            this.setData({
                from: from
            })
        }

        this.getAppId()

        getStorage('notFirst').then(() => {
            // 非首次登陆
        }).catch(() => {
            // 首次登陆
            this.setData({
                guide: true
            })
        })

        if (!this.data.showLoak) {
            getStorage('rankDialog').then(res => {
                let dialog = false
                const day = new Date()
                const num = day.getDay()
                if (num) {
                    dialog = true
                }
                day.setDate(day.getDate() + 1 - num)
                day.setHours(0, 0, 0, 0)
                if (res < day.getTime() && dialog) {
                    this.getRankDialog()
                }
            }).catch(() => {
                this.getRankDialog()
            })
        }

        this.checkAppGlobalData()
    },

    getAppId() {
        getWithWhere('appid', {position: 'appid'}).then(appidList => {
            if (appidList.length) {
                const appid = appidList[0].appid
                userBase.setGlobalData({
                    appid: appid
                })
            }
        })
    },

    getRankDialog() {
        scheduleService.queryRankingWeek().then(res => {
            this.formatSort(res.details)
            const nowTime = new Date().getTime()
            if (!this.data.showLoak && nowTime > 1584288000000) {
                this.setData({
                    showRank: true,
                    rankDialogInfo: res
                })
                wx.setStorage({
                    key: 'rankDialog',
                    data: new Date().getTime()
                })
            }
        })
    },
    formatSort(data) {
        data.sort((a, b) => {
            let value1 = a['cnt']
            let value2 = b['cnt']
            return value1 - value2
        })
    },

    onCloseTip() {
        this.setData({
            guide: false
        })
        wx.setStorage({
            key: 'notFirst',
            data: true
        })
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
        this.refresh()
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
        if (!addLoding && this.data.active === -1) {
            addLoding = true
            const seqno = this.data.roomList[this.data.roomList.length - 1].seqno
            this.addRoomList(seqno)
        }
        if (!healthLoding && this.data.active === 2) {
            healthLoding = true
            const seqno = this.data.healthList[this.data.healthList.length - 1].seqno
            this.addHealthList(seqno)
        }
    },

    addHealthList(seqno) {
        scheduleService.queryCategory(100, seqno).then(res => {
            const list = [...this.data.healthList, ...res]
            this.setData({
                healthList: list
            })
            healthLoding = false
        }).catch(() => {
            healthLoding = false
        })
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
            case "booking": {
                Toast.loading({
                    message: '预约提交中...',
                    duration: 0,
                });
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

    onOpenLessonEvent(event) {
        getStorage('lessonDialog').then(res => {
            lessonDialogFirstTime = res.lessonDialogFirstTime
            lessonDialogNumber = res.lessonDialogNumber
            this.lessonDialogToReady(event)
        }).catch(() => {
            lessonDialogFirstTime = null
            lessonDialogNumber = 0
            this.lessonDialogToReady(event)
        })
    },

    lessonDialogToReady(event) {
        if (!this.data.showLoak) {

            const nowTime = new Date().getTime()
            if (lessonDialogFirstTime && (nowTime - lessonDialogFirstTime) < 40 * 60 * 1000 && lessonDialogNumber > 2) {
                return
            }

            if (((nowTime - lessonDialogFirstTime) > 40 * 60 * 1000) || !lessonDialogFirstTime) {
                lessonDialogFirstTime = nowTime
                lessonDialogNumber = 1

                wx.setStorage({
                    key: "lessonDialog",
                    data: {
                        lessonDialogFirstTime: lessonDialogFirstTime,
                        lessonDialogNumber: lessonDialogNumber
                    }
                })
            } else {
                lessonDialogNumber++
                wx.setStorage({
                    key: "lessonDialog",
                    data: {
                        lessonDialogFirstTime: lessonDialogFirstTime,
                        lessonDialogNumber: lessonDialogNumber
                    }
                })
            }

            this.setData({
                sessionFrom: 'type=course'
            })
            if (app && app.globalData) {
                if (app.globalData.query && app.globalData.query.from) {
                    this.setData({
                        sessionFrom: this.data.sessionFrom + '&from=' + app.globalData.query.from
                    })
                }
                if (app.globalData.scene) {
                    this.setData({
                        sessionFrom: this.data.sessionFrom + '&scenes=' + app.globalData.scene
                    })
                }
            }
            const openLesson = event.detail.openLesson
            this.setData({
                welcomeBgHeight: 259 + openLesson.length * 326,
                showOpenLesson: true,
                openLesson: openLesson
            })
        }
    },

    onOverlayEvent() {
        //  加锁后续弹窗
        this.setDialog()
    },

    closeOverlay() {
        //  解锁后续弹窗
        this.setData({
            show: false,
            showLoak: false
        });
    },

    tabChange(event) {
        const index = event.detail.index
        const nowActive = this.data.tabActive
        if (index === nowActive) {
            return
        }
        if ( index !== nowActive && (index !== 1  || index !== 4)) {
            if (wx.pageScrollTo) {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                })
            }
        }
        if (index === 2 || index === 3) {
            if (!userBase.getGlobalData().authed) {
                this.setDialog()
            }
        }
        if (index === 4) {
            this.setSimpleUserModel()
            if (!userBase.getGlobalData().authed) {
                this.setDialog()
            }
        }
        this.setNavTitle(index)
    },
    setNavTitle(index) {
        switch (index) {
            case 0: {
                wx.setNavigationBarTitle({
                    title: '红松课表'
                })
                this.setData({
                    nowCategory: category,
                    active: activeTmp,
                    tabActive: index
                })
                this.refreshHome()
                break;
            }
            case 1: {
                const nowActive = this.data.tabActive
                const lessonData = this.data.list[1]
                if (lessonData) {
                    this.jumpMini()
                }
                this.setData({
                    tabActive: nowActive
                })
                break
            }
            case 2: {
                this.refreshHealth()
                wx.setNavigationBarTitle({
                    title: '连线调理'
                })
                this.setData({
                    active: index,
                    tabActive: index
                })
                break
            }
            case 3: {
                wx.setNavigationBarTitle({
                    title: '讨论组'
                })
                this.setData({
                    active: index,
                    tabActive: index
                })
                break
            }
            case 4: {
                wx.setNavigationBarTitle({
                    title: '我'
                })
                this.setData({
                    active: index,
                    tabActive: index
                })
                break
            }
        }
    },
    jumpMini() {
        if (debounceForFunction()) {
            return;
        }
        wx.navigateToMiniProgram({
            appId: 'wxbe86c353682cdb84',
            success() {}
        })
    },
    //  获取弹窗
    setDialog() {
        getWithWhere('dailog', {position: 'dailog'}).then(dialogList => {
            if (dialogList.length) {
                const dialogInfo = dialogList[0]
                this.setData({
                    show: true,
                    showLoak: true,
                    btnTitle: dialogInfo.btnTitle,
                    img: dialogInfo.img,
                    title: dialogInfo.title
                });
            }
        })
    },
    onClickHide() {
        // this.closeOverlay()
    },
    onClickHideOpenLesson() {
        this.setData({
            showOpenLesson: false
        })
    },

    onClickHideRank() {
        this.setData({
            showRank: false
        })
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
                                    ...userBase.getGlobalData(),
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
                this.setData({
                    active: 0
                })
                this.closeOverlay()
            }
        }).catch(() => {
            this.setData({
                active: activeTmp,
                tabActive: 0
            })
            this.closeOverlay()
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
    },
    checkAppGlobalData() {
        if (app && app.globalData) {
            if (app.globalData.query) {
                if (app.globalData.query.event === 'course') {
                    const code = app.globalData.query.code
                    if (code) {
                        //  启动弹窗提醒查看课程
                        getStorage('code').then(codeRes => {
                            if (codeRes !== code) {
                                this.setShowOpenLessonLoak(code)
                            } else {
                                //  解锁后续弹窗
                                this.setData({
                                    showLoak: false
                                })
                            }
                        }).catch(() => {
                            this.setShowOpenLessonLoak(code)
                        })
                    }
                }
            }
        }
    },
    setShowOpenLessonLoak(code) {
        //  加锁禁止后续弹窗并启动弹窗提醒查看课程
        http.get('/course/api/querybycode', {code: code}, userBase.getGlobalData().sessionId).then(openLesson => {
            if (openLesson && openLesson.state && openLesson.state.code === '0' && openLesson.data) {
                this.setData({
                    showLoak: true,
                    showOpenLesson: true,
                    welcomeBgHeight: 555,
                    openLesson: [openLesson.data]
                })
                wx.setStorage({
                    key: 'code',
                    data: code
                })
            } else {
                this.setData({
                    showLoak: false
                })
            }
        }).catch(() => {
            this.setData({
                showLoak: false
            })
        })
    },
    onLook(event) {
        const value = event.currentTarget.dataset.value
        const lessonCode = value.code
        wx.setStorage({
            key: 'lessonCode',
            data: lessonCode
        })
        this.setData({
            showOpenLesson: false,
            openLesson: []
        })
    },

    onJumpLook(event) {
        if (debounceForFunction()) {
            return
        }
        const value = event.currentTarget.dataset.value
        switch (value.linkto) {
            case 0: {
                this.jumpOldLook(value)
                break;
            }
            case 1: {
                this.jumpNewLook(value)
                break
            }
        }
    },
    jumpOldLook(value) {
        const path = value.miniPath
        wx.navigateToMiniProgram({
            appId: 'wxbe86c353682cdb84',
            path: path,
            success() {
            }
        })
    },
    jumpNewLook(value) {
        const roomID = value.roomId
        const roomName = value.title
        const appid = userBase.getGlobalData().appid ? userBase.getGlobalData().appid : 'wx7854b9c2baa260f7'
        const path = `pages/mlvb-live-room-demo/live-room-page/room?roomID=${roomID}&roomName=${roomName}`
        wx.navigateToMiniProgram({
            appId: appid,
            path: path,
            envVersion: 'trial',
            success() {
            }
        })
    },

    onShowSheet() {
        this.setData({showSheet: true});
    },

    onCloseSheet() {
        this.setData({showSheet: false});
    },

    onChangeTabEvent(event) {
        const index = event.detail.index
        category = index
        this.setData({
            nowCategory: category
        })
        if (lesson && lesson[index] && lesson[index].length) {
            this.setData({
                roomList: lesson[index]
            })
        } else {
            this.setData({
                roomList: []
            })
            this.refreshLessonList()
        }
    }
})