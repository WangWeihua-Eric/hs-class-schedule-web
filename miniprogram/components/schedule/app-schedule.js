import {UserBase} from "../../utils/user-utils/user-base";
import {HttpUtil} from "../../utils/http-utils/http-util";
import {getSettingWithSubscriptions, wxSubscribeMessage} from "../../utils/wx-utils/wx-base-utils";
import {getWithWhere} from "../../utils/wx-utils/wx-db-utils";

const userBase = new UserBase()
const http = new HttpUtil()

let timeHandler = null
let timeHandlerNumber = 0

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        scrollTop: {
            type: Number,
            value: null
        },
        showShareBtn: {
            type: Boolean,
            value: true
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
        officialAccountShow: false,
        officialAccountError: true
    },

    pageLifetimes: {
        show: function () {
            this.setData({
                officialAccountShow: false
            })
            this.sessionIdReady()
        }

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

        onBooking(event) {
            const tmplIds = this.data.tempId
            const status = {}
            const value = event.currentTarget.dataset.value

            getSettingWithSubscriptions().then(res => {

                const sendTempId = []
                const inSettingId = []

                tmplIds.forEach(id => {
                    if (!res.subscriptionsSetting[id]) {
                        sendTempId.push(id)
                    } else {
                        inSettingId.push(id)
                        status[id] = res.subscriptionsSetting[id]
                    }
                })

                if (sendTempId.length) {
                    this.setData({
                        show: true
                    })

                    wxSubscribeMessage(sendTempId).then((res) => {

                        this.setData({
                            show: false
                        })

                        sendTempId.forEach(id => {
                            status[id] = res[id]
                        })

                        this.sendSubscribecourse(tmplIds, status, value)


                    }).catch((error) => {
                    })
                } else {
                    // 已经总是允许
                    this.sendSubscribecourse(tmplIds, status, value)
                }


            }).catch(error => {

            })


        },

        sendSubscribecourse(tmplIds, status, value) {
            const readySendData = []
            tmplIds.forEach(id => {
                if (status[id] === 'accept') {
                    readySendData.push(id)
                }
            })
            if (readySendData.length) {
                const param = {
                    sessionId: userBase.getGlobalData().sessionId,
                    courseCode: value.code,
                    appSign: 'hongsongkebiao',
                    templateIds: readySendData.toString()
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
                this.bookingRes('reject')
            }
        },

        bookingRes(type) {
            switch (type) {
                case 'ok': {
                    this.getPageInfo()
                    const param = {
                        title: '预约结果',
                        message: '预约成功'
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
                        title: '预约结果',
                        message: '预约失败，请同意消息订阅'
                    }
                    this.triggerEvent('dialogEvent', param)
                    break
                }
            }
        },

        formatSchedule(schedule) {
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

                    endTime = endTime + ' ' + finishTime[1]

                    if (new Date(endTime).getTime() < nowTime.getTime()) {
                        isEnd = true
                    }
                    courseItem.isEnd = isEnd
                })
            })
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

            // getWithWhere('scheduleDay', {type: 'scheduleTime'}).then(res => {
            //     if (res.length) {
            //         const scheduleTime = res[0]
            //         const startTime = scheduleTime.startTime
            //         const endTime = scheduleTime.endTime
            //         this.setData({
            //             startTime: startTime,
            //             endTime: endTime,
            //             scheduleDay: this.formatDay(startTime) + ' - ' + this.formatDay(endTime)
            //         })
            //     }
            // })


            const now = new Date();
            const nowTime = now.getTime();
            const day = now.getDay();
            const oneDayTime = 24 * 60 * 60 * 1000;
            const MondayTime = nowTime - (day - 1) * oneDayTime;//显示周一
            const SundayTime = nowTime + (7 - day) * oneDayTime;//显示周日

            const nowDate = new Date(MondayTime)
            const endDate = new Date(SundayTime)
            this.setData({
                scheduleDay: this.formatDay(nowDate.getTime()) + ' - ' + this.formatDay(endDate.getTime())
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

        /**
         * 跳转公众号文章
         */
        toWxLink() {
            this.setData({
                officialAccountShow: true
            })
        },

        /**
         * 公众号组件加载成功
         */
        officialAccountLoad(e) {
            this.setData({
                officialAccountError: false
            })
        },

        /**
         * 公众号组件加载失败
         */
        officialAccountError(e) {
            this.setData({
                officialAccountError: true
            })
        },
        onCloseOfficialAccount() {
            this.setData({
                officialAccountShow: false
            })
        }
    }
})
