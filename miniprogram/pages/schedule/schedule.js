// pages/schedule/schedule.js
import {HttpUtil} from "../../utils/http-utils/http-util";
import Dialog from '@vant/weapp/dialog/dialog';
import {getSettingWithSubscriptions, getStorage, wxSubscribeMessage} from "../../utils/wx-utils/wx-base-utils";
import {getWithWhere} from "../../utils/wx-utils/wx-db-utils";
import {UserBase} from "../../utils/user-utils/user-base";
import Toast from '@vant/weapp/toast/toast';

const userBase = new UserBase()

Page({
    scrollTopTimeOut: null,
    http: new HttpUtil(),
    timeHandler: null,
    timeHandlerNumber: 0,

    /**
     * 页面的初始数据
     */
    data: {
        indexList: [],
        showShareBtn: true,
        schedule: [],
        scheduleDay: '',
        startTime: '',
        endTime: '',
        bannerList: [],
        indicatorDots: false,
        show: false,
        guide: false,
        tempId: [],
        officialAccountShow: false,
        officialAccountError: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        getStorage('first').then(res => {
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
            }, 10000)
            wx.setStorage({
                key: 'first',
                data: true
            })
        })
    },
    /**
     * 刷新逻辑
     */
    refresh() {
        if (!this.data.schedule.length) {
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
            });
        }
        //  获取tempId
        this.getTempId()

        //  获取 pageInfo
        this.getPageInfo()

        //  获取轮播
        this.getBanner()
    },
    sessionIdReady() {
        if (this.timeHandler) {
            clearTimeout(this.timeHandler)
            this.timeHandler = null
        }
        if (userBase.getGlobalData().sessionId) {
            this.timeHandlerNumber = 0
            this.refresh()
        } else {
            if (this.timeHandlerNumber < 100) {
                this.timeHandlerNumber++
                this.timeHandler = setTimeout(() => {
                    this.sessionIdReady()
                }, 100)
            }
        }
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
        this.setData({
            officialAccountShow: false
        })
        this.sessionIdReady()
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
            imageUrl: '../../images/share.png',
            success: () => {
                wx.showShareMenu({
                    withShareTicket: true
                })
            }
        }
    },

    onPageScroll(event) {
        if (this.scrollTopTimeOut) {
            clearTimeout(this.scrollTopTimeOut);
        }
        this.scrollTopTimeOut = setTimeout(() => {
            // 滑动停止的代码，此处半秒内位置不变即为滑动停止。
            this.setData({
                showShareBtn: true
            })
        }, 100);
        this.setData({
            scrollTop: event.scrollTop,
            showShareBtn: false
        });
    },

    onBooking(event, ownerInstance) {

        const tmplIds = this.data.tempId
        const status = {}
        const value = event.currentTarget.dataset.value

        getSettingWithSubscriptions().then(res => {

            const sendTempId = []
            const inSettingId = []

            tmplIds.forEach(id => {
                if(!res.subscriptionsSetting[id]) {
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




                }).catch((error) => {})
            } else {
                // 已经总是允许
                this.sendSubscribecourse(tmplIds, status, value)
            }




        }).catch(error => {

        })


    },
    sendSubscribecourse(tmplIds, status, value){
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
            this.http.post('/subscribe/api/subscribecourse', param, userBase.getGlobalData().sessionId).then((res) => {
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
                Dialog.alert({
                    title: '预约结果',
                    message: '预约成功'
                }).then(() => {
                });
                break
            }
            case 'error': {
                Dialog.alert({
                    title: '预约结果',
                    message: '预约失败'
                }).then(() => {
                });
                break
            }
            case 'reject': {
                Dialog.alert({
                    title: '预约结果',
                    message: '预约失败，请同意消息订阅'
                }).then(() => {
                });
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
    }
    ,

    formatDay(timeTemp) {
        const date = new Date(parseInt(timeTemp))
        return date.getMonth() + 1 + '月' + date.getDate() + '日'
    }
    ,

    onClickShow() {
        this.setData({show: true});
    }
    ,

    onClickHide() {
        this.setData({show: false});
    }
    ,

    noop() {
    }
    ,

    /**
     * 获取 tempId
     */
    getTempId() {
        const url = '/subscribe/api/templates'
        const param = {
            appSign: 'hongsongkebiao',
            page: 'schedule'
        }
        this.http.get(url, param, userBase.getGlobalData().sessionId).then(tempInfo => {
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
        const nowTime = now.getTime() ;
        const day = now.getDay();
        const oneDayTime = 24 * 60 * 60 * 1000 ;
        const MondayTime = nowTime - (day-1)*oneDayTime ;//显示周一
        const SundayTime =  nowTime + (7-day)*oneDayTime ;//显示周日

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
        this.http.get(url, params, userBase.getGlobalData().sessionId).then(pageInfo => {
            if (pageInfo && pageInfo.state && pageInfo.state.code === "0") {
                this.formatSchedule(pageInfo.data)
                this.setData({
                    schedule: pageInfo.data
                })
                Toast.clear()
            }
        })
    }
    ,

    formatYMD(time) {
        return time.getFullYear() + '-' + this.addZero(time.getMonth() + 1) + '-' + this.addZero(time.getDate())
    }
    ,

    // 数字补0操作
    addZero(num) {
        return num < 10 ? '0' + num : num;
    }
    ,

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
    toWxLink(){
        this.setData({
            officialAccountShow: true
        })
    },

    /**
     * 公众号组件加载成功
     */
    officialAccountLoad(e) {
        // console.log('公众号组件加载成功: ', e)
        this.setData({
            officialAccountError: false
        })
    },

    /**
     * 公众号组件加载失败
     */
    officialAccountError(e) {
        // Dialog.alert({
        //     title: '公众号组件加载失败',
        //     message: JSON.stringify(e)
        // }).then(() => {
        // });

        this.setData({
            officialAccountError: true
        })
        // wx.navigateTo({
        //     url: '../wxlink/wxlink'
        // })
    },
    onCloseOfficialAccount() {
        this.setData({
            officialAccountShow: false
        })
    },
    onCopyCode: function () {
        wx.setClipboardData({
            data: '红松学堂',
            success(res) {
                wx.getClipboardData({
                    success: (res) => {
                    }
                })
            }
        })
    }
})