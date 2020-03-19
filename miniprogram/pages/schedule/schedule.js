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

Page({
    /**
     * 页面的初始数据
     */
    data: {
        showCallTeacher: false,
        rankDialogInfo: {},
        showRank: false,
        guide: false,
        scrollTop: null,
        active: 0,
        show: false,
        showSheet: false,
        showOpenLesson: false,
        simpleUserModel: {},
        openLesson: [],
        welcomeBgHeight: 555,
        sessionFrom: 'type=course',
        serviceImgUrl: '../../images/clickme.jpeg',
        showLoak: false,
        miniJump: false,
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
                "selectedIconPath": "/images/in-class-active.png",
                "serviceImgUrl": '../../images/clickme.jpeg',
                "sessionFrom": 'type=courselist',
                "jump": false
            },
            {
                "text": "老师家族",
                "iconPath": "/images/thx.png",
                "selectedIconPath": "/images/thx-active.png"
            },
            {
                "text": "我",
                "iconPath": "/images/me.png",
                "selectedIconPath": "/images/me-active.png"
            }
        ],
        aid: '',
        gdt_vid: '',
        weixinadinfo: '',
        from: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const active = options.active
        if (active) {
            const index = parseInt(active)
            this.setNavTitle(index)
            this.setData({
                active: index
            })
        }

        // url参数中可以获取到gdt_vid、weixinadinfo参数值
        const gdt_vid = options.gdt_vid
        const weixinadinfo = options.weixinadinfo
        // 获取广告id
        let aid = 0
        if (weixinadinfo) {
            const weixinadinfoArr = weixinadinfo.split('.')
            aid = weixinadinfoArr[0]
        }
        const from = options.from

        if (gdt_vid) {
            this.setData({
                aid: aid,
                gdt_vid: gdt_vid,
                weixinadinfo: weixinadinfo,
                from: from
            })
        }


        if (from) {
            wx.reportAnalytics('page_lode_from', {
                from: from,
            });
        }

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
                const day = new Date()
                const num = day.getDay()
                day.setDate(day.getDate() + 1 - num)
                day.setHours(0, 0, 0, 0)
                if (res < day.getTime()) {
                    this.getRankDialog()
                }
            }).catch(() => {
                this.getRankDialog()
            })
        }
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
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTabbarItemInfo()
        this.checkAppGlobalData()
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
        const nowActive = this.data.active
        if (index === nowActive) {
            return
        }
        if ((index === 0 && nowActive === 2) || (index === 2 && nowActive === 0)) {
            if (wx.pageScrollTo) {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                })
            }
        }
        if (index === 2) {
            if (!userBase.getGlobalData().authed) {
                this.setDialog()
            }

            getStorage('callTeacher').then(res => {
                if (res) {
                    if (res.dayNumber < 3) {
                        const nowDay = new Date()
                        if (res.day !== nowDay.getDate()) {
                            // 展示
                            this.setData({
                                showCallTeacher: true
                            })
                            wx.setStorage({
                                key: "callTeacher",
                                data: {
                                    dayNumber: 2,
                                    day: nowDay.getDate(),
                                    showNumber: 1
                                }
                            })
                        } else {
                            if (res.showNumber < 2) {
                                // 展示
                                this.setData({
                                    showCallTeacher: true
                                })

                                wx.setStorage({
                                    key: "callTeacher",
                                    data: {
                                        dayNumber: res.dayNumber === 2 ? 3 : res.dayNumber,
                                        day: nowDay.getDate(),
                                        showNumber: 2
                                    }
                                })
                            }
                        }
                    }
                }
            }).catch(() => {
                this.setData({
                    showCallTeacher: true
                })
                const nowDay = new Date()
                wx.setStorage({
                    key: "callTeacher",
                    data: {
                        dayNumber: 1,
                        day: nowDay.getDate(),
                        showNumber: 1
                    }
                })
            })

        }
        if (index === 3) {
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
                this.setData({active: index})
                break;
            }
            case 1: {
                const nowActive = this.data.active
                const lessonData = this.data.list[1]
                if (lessonData && lessonData.jump) {
                    this.jumpMini()
                }
                this.setData({
                    active: nowActive
                })
                break
            }
            case 2: {
                wx.setNavigationBarTitle({
                    title: '老师家族'
                })
                this.setData({active: index})
                break
            }
            case 3: {
                wx.setNavigationBarTitle({
                    title: '我'
                })
                this.setData({active: index})
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

    onClickHideCallTeacher() {
        this.setData({
            showCallTeacher: false
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


                    if (this.data.gdt_vid) {
                        const aid = this.data.aid
                        const gdt_vid = this.data.gdt_vid
                        const weixinadinfo = this.data.weixinadinfo
                        const from = this.data.from
                        wx.reportAnalytics('wx_gongzhonghao', {
                            aid: aid,
                            gdt_vid: gdt_vid,
                            weixinadinfo: weixinadinfo,
                            from: from,
                        });
                        const params = {
                            appSign: 'hongsonggongzhonghao',
                            setid: '1110214397',
                            url: 'http://www.' + app.globalData.path + '?gdt_vid=' + gdt_vid + '&weixinadinfo=' + weixinadinfo,
                            gdtvid: gdt_vid
                        }
                        http.post('/ad/api/user/actions/add', params).then(() => {
                        })
                    }
                })
            } else {
                // 拒绝
                this.setData({active: 0})
                this.closeOverlay()
            }
        }).catch(() => {
            this.setData({active: 0})
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
                if (app.globalData.query.from) {
                    const tabbarList = this.data.list
                    tabbarList[1].sessionFrom = this.data.list[1].sessionFrom + '&from=' + app.globalData.query.from
                    this.setData({
                        list: tabbarList
                    })
                }
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
            if (app.globalData.scene) {

                const tabbarList = this.data.list
                tabbarList[1].sessionFrom = this.data.list[1].sessionFrom + '&scenes=' + app.globalData.scene
                this.setData({
                    list: tabbarList
                })
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

        let path = ''
        if (value.miniPath) {
            path = value.miniPath
        }

        wx.navigateToMiniProgram({
            appId: 'wxbe86c353682cdb84',
            path: path,
            success() {
            }
        })
    },

    //  获取 tabbarInfo
    getTabbarItemInfo() {
        getWithWhere('tabbar', {position: 'tabbar'}).then(tabbarInfo => {
            if (tabbarInfo && tabbarInfo.length) {
                const jumpItem = tabbarInfo[0].jump
                this.setData({
                    miniJump: jumpItem
                })
                const tabbarList = this.data.list
                tabbarList[1].jump = jumpItem
                this.setData({
                    list: tabbarList
                })
            }
        })
    },

    onShowSheet() {
        this.setData({showSheet: true});
    },

    onCloseSheet() {
        this.setData({showSheet: false});
    },
})