import {UserBase} from "../../utils/user-utils/user-base";
import {HttpUtil} from "../../utils/http-utils/http-util";
import {getSettingWithSubscriptions, getStorage, wxSubscribeMessage} from "../../utils/wx-utils/wx-base-utils";
import {getWithWhere} from "../../utils/wx-utils/wx-db-utils";

const userBase = new UserBase()
const http = new HttpUtil()
const app = getApp()

let timeHandler = null
let timeHandlerNumber = 0
let readyStep = 0

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        scrollTop: {
            type: Number,
            value: null
        },
        miniJump: {
            type: Boolean,
            value: false
        },
        active: {
            type: Number,
            value: null
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        indexList: [],
        schedule: [],
        scheduleDay: '',
        startTime: '',
        endTime: '',
        bannerList: [],
        indicatorDots: false,
        show: false,
        tempId: [],
        sessionFrom: '',
        serviceImgUrl: '../../images/clickme.jpeg',
        scrollBtnShow: true,
        isContactBack: false,
        awaysErrorMiniSwitch: false,
        needGuide: false
    },

    pageLifetimes: {
        show: function () {
            this.refresh()
        }

    },

    refresh() {
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
        this.sessionIdReady()
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 刷新逻辑
         */
        refresh() {
            if (!this.data.schedule.length) {
                this.triggerEvent('toastEvent', {message: '加载中...', action: 'load'})
            }
            readyStep = 0
            //  获取tempId
            this.getTempId()

            //  获取 pageInfo
            this.getPageInfo()

            //  获取轮播
            this.getBanner()
        },

        sessionIdReady() {
            if (timeHandler) {
                clearTimeout(timeHandler)
                timeHandler = null
            }
            if (userBase.getGlobalData().sessionId) {
                timeHandlerNumber = 0
                if (!userBase.getGlobalData().authed) {
                    // 未注册用户，发射引导弹窗
                    this.triggerEvent('overlayEvent')
                }
                this.refresh()
            } else {
                if (timeHandlerNumber < 100) {
                    timeHandlerNumber++
                    timeHandler = setTimeout(() => {
                        this.sessionIdReady()
                    }, 100)
                }
            }
        },

        onJumpLook(event) {
            const value = event.currentTarget.dataset.value
            let path = ''
            if (value.miniPath) {
                path = value.miniPath
            }

            wx.navigateToMiniProgram({
                appId: 'wxbe86c353682cdb84',
                path: path,
                success() {}
            })
        },

        onBooking(event) {
            const tmplIds = this.data.tempId
            const value = event.currentTarget.dataset.value
            // 检查是否打开订阅开关
            if (this.data.awaysErrorMiniSwitch) {
                this.bookingRes('awaysErrorMiniSwitch')
            } else {
                //  发起订阅请求
                if (this.data.needGuide) {
                    this.setData({
                        show: true
                    })
                } else {
                    this.triggerEvent('toastEvent', {action: 'booking'})
                }
                wxSubscribeMessage(tmplIds).then((res) => {
                    getSettingWithSubscriptions().then(subscriptionsAgain => {
                        // 检查是否总是允许所有 id
                        if (this.checkAwaysSubscriptions(subscriptionsAgain, tmplIds)) {
                            // 已总是允许所有 id 准备发起预定请求
                            this.sendSubscribecourse(tmplIds, value)
                        } else {
                            //  有 id 没有被总是允许，准备弹窗提示
                            if (tmplIds.some(item => res[item] === 'reject')) {
                                this.bookingRes('reject')
                            } else {
                                this.bookingRes('awaysError')
                            }
                        }
                    })
                }).catch(() => {
                    this.bookingRes('awaysErrorMiniSwitch')
                })
            }
        },

        checkAways(subscriptionsRes, tmplIds) {
            const scriptionsInfo = subscriptionsRes.subscriptionsSetting
            if (scriptionsInfo) {
                const notScriptions = tmplIds.filter(item => !scriptionsInfo[item])
                if (notScriptions.length) {
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        },

        checkMainSwitch(subscriptionsRes) {
            const scriptionsInfo = subscriptionsRes.subscriptionsSetting
            if (scriptionsInfo && scriptionsInfo.mainSwitch === false) {
                return false
            }
            return true
        },

        checkAwaysSubscriptions(subscriptionsRes, tmplIds) {
            const scriptionsInfo = subscriptionsRes.subscriptionsSetting
            if (scriptionsInfo) {
                const notScriptions = tmplIds.filter(item => {
                    return !scriptionsInfo[item] || scriptionsInfo[item] !== 'accept'
                })
                if (notScriptions.length) {
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        },

        sendSubscribecourse(tmplIds, value) {
            if (value) {
                const param = {
                    courseCode: value.code,
                    appSign: 'hongsongkebiao',
                    templateIds: tmplIds.toString()
                }
                http.post('/subscribe/api/subscribecourse', param, userBase.getGlobalData().sessionId).then((res) => {
                    if (res && res.result && res.result.state && res.result.state.code === '0') {
                        this.bookingRes('ok')
                    } else {
                        this.bookingRes('error')
                    }
                }).catch(() => {
                    this.bookingRes('error')
                })
            } else {
                this.bookingRes('bookedSchedule')
            }
        },

        bookingRes(type) {
            this.triggerEvent('toastEvent', {action: 'close'})
            readyStep = 0
            this.bookInit()
            this.setData({
                show: false
            })
            switch (type) {
                case 'ok': {
                    this.getPageInfo()
                    const param = {
                        title: '预约成功',
                        message: '我们会在课前 30 分钟通知您进直播间上课哦！'
                    }
                    this.triggerEvent('dialogEvent', param)
                    break
                }
                case 'error': {
                    const param = {
                        title: '预约结果',
                        message: '预约失败'
                    }
                    this.triggerEvent('dialogEvent', param)
                    break
                }
                case 'reject': {
                    const param = {
                        title: '预约失败',
                        message: '请同意消息订阅'
                    }
                    this.triggerEvent('dialogEvent', param)
                    break
                }
                case 'awaysError': {
                    const param = {
                        title: '预约失败',
                        message: '您在订阅时必须勾选「总是保持以上选择，不再询问」'
                    }
                    this.triggerEvent('dialogEvent', param)
                    break
                }
                case 'bookedSchedule': {
                    const param = {
                        title: '预约成功',
                        message: '我们将在课表更新时提醒您'
                    }
                    this.triggerEvent('dialogEvent', param)
                    break
                }
                case 'awaysErrorMiniSwitch': {
                    const param = {
                        title: '预约失败',
                        message: '请通过小程序设置打开订阅消息！'
                    }
                    this.triggerEvent('dialogEvent', param)
                    break
                }
            }
        },

        formatSchedule(schedule) {
            const openLesson = []
            let isSetBook = false
            schedule.forEach((dayItem) => {
                const courses = dayItem.courses
                courses.forEach(courseItem => {
                    let isEnd = false
                    const nowTime = new Date()
                    const itemDate = dayItem.group.date.split('月')
                    const itemMouth = this.addZero(itemDate[0])
                    const itemDay = this.addZero(itemDate[1].split('日')[0])
                    let endTime = nowTime.getFullYear() + '/' + itemMouth + '/' + itemDay

                    let time = '上午'

                    const startTime = courseItem.startTime.split(' ')
                    const finishTime = courseItem.finishTime.split(' ')
                    if (startTime[0] === 'PM') {
                        time = '下午'
                    }
                    time = time + ' ' + startTime[1] + ' - ' + finishTime[1]
                    courseItem.time = time

                    const startTimeStatic = endTime + ' ' + startTime[1]
                    const preStartTime = new Date(startTimeStatic).getTime() - 30 * 60 * 1000

                    endTime = endTime + ' ' + finishTime[1]
                    const endStartTime = new Date(endTime).getTime()
                    const nowStartTime = nowTime.getTime()

                    if (endStartTime < nowStartTime) {
                        isEnd = true
                    }
                    courseItem.isEnd = isEnd

                    if (preStartTime < nowStartTime && nowStartTime < endStartTime) {
                        openLesson.push(courseItem)
                    }
                    if (courseItem.booked === 0) {
                        isSetBook = true
                    }
                })
            })

            if (isSetBook) {
                readyStep++
                if (readyStep === 2) {
                    //  存在没有预定课程，发起授权检测
                    this.bookInit()
                }
            }

            if (openLesson.length && app.globalData.scene !== 1038) {
                this.triggerEvent('openLessonEvent', {openLesson: openLesson})
            }
        },

        bookInit() {
            const tmplIds = this.data.tempId
            if (tmplIds.length) {
                let awaysErrorMiniSwitch = false
                let needGuide = false
                getSettingWithSubscriptions().then(subscriptionsRes => {
                    // 检查是否打开订阅开关
                    if (!this.checkMainSwitch(subscriptionsRes)) {
                        awaysErrorMiniSwitch = true
                    } else {
                        //  发起订阅请求
                        if (!this.checkAways(subscriptionsRes, tmplIds)) {
                            needGuide = true
                        }
                    }

                    this.setData({
                        awaysErrorMiniSwitch: awaysErrorMiniSwitch,
                        needGuide: needGuide
                    })
                })
            }
        },

        formatDay(timeTemp) {
            const date = new Date(parseInt(timeTemp))
            return date.getMonth() + 1 + '月' + date.getDate() + '日'
        },

        onClickHide() {
            this.setData({show: false});
        },

        noop() {
        },

        /**
         * 获取 tempId
         */
        getTempId() {
            const url = '/subscribe/api/templates'
            const param = {
                appSign: 'hongsongkebiao',
                page: 'schedule'
            }
            http.get(url, param, userBase.getGlobalData().sessionId).then(tempInfo => {
                if (tempInfo && tempInfo.state && tempInfo.state.code === "0") {
                    if (tempInfo.data) {
                        this.setData({
                            tempId: tempInfo.data.templateIds
                        })
                        readyStep++
                        if (readyStep === 2) {
                            this.bookInit()
                        }
                    } else {
                        this.setData({
                            tempId: []
                        })
                    }
                }
            })
        },

        /**
         * 获取 pageInfo
         */
        getPageInfo() {
            const now = new Date();
            const nowTime = now.getTime();
            const day = now.getDay();
            const oneDayTime = 24 * 60 * 60 * 1000;
            const MondayTime = nowTime - (day - 1) * oneDayTime;//显示周一
            const SundayTime = nowTime + (15 - day) * oneDayTime;//显示周日

            const nowDate = new Date(MondayTime)
            const endDate = new Date(SundayTime)
            this.setData({
                scheduleDay: this.formatDay(nowDate.getTime()) + ' - ' + this.formatDay(endDate.getTime() - 8 * 24 * 60 * 60 * 1000)
            })


            const url = '/course/api/schedules'
            const params = {
                startTime: this.formatYMD(nowDate),
                finishTime: this.formatYMD(endDate)
            }
            http.get(url, params, userBase.getGlobalData().sessionId).then(pageInfo => {
                if (pageInfo && pageInfo.state && pageInfo.state.code === "0") {
                    this.formatSchedule(pageInfo.data)
                    this.setData({
                        schedule: pageInfo.data
                    })
                    this.triggerEvent('toastEvent', {action: 'close'})

                    if (!(this.data.scrollBtnShow && this.data.scrollTop > 168) && app.globalData.scene !== 1038 && !this.data.isContactBack) {
                        let query = this.createSelectorQuery();
                        const week = new Date().getDay()
                        if (week > 1) {
                            const id = `#day-${week - 1}`
                            query.select(id).boundingClientRect(rect => {
                                if (rect && rect.top && app.globalData.windowHeight && rect.top > app.globalData.windowHeight / 2) {
                                    wx.pageScrollTo({
                                        scrollTop: rect.top + 3 + (this.data.scrollTop ? this.data.scrollTop : 0),
                                        duration: 500
                                    })
                                }
                            }).exec();
                        }
                    }
                    this.setData({
                        isContactBack: false
                    })
                }
            })
        },

        formatYMD(time) {
            return time.getFullYear() + '-' + this.addZero(time.getMonth() + 1) + '-' + this.addZero(time.getDate())
        },

        // 数字补0操作
        addZero(num) {
            return num < 10 ? '0' + num : num;
        },

        //  获取轮播
        getBanner() {
            getWithWhere('banner', {position: 'schedule'}).then(bannerList => {
                if (bannerList.length) {
                    this.setData({
                        bannerList: bannerList,
                        indicatorDots: true
                    })
                } else {
                    this.setData({
                        indicatorDots: false
                    })
                }
            })
        },

        onSetContact() {
            this.setData({
                isContactBack: true
            })
        }
    }
})
