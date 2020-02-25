// pages/schedule/schedule.js
import {HttpUtil} from "../../utils/http-utils/http-util";
import Dialog from '@vant/weapp/dialog/dialog';
import {getSettingWithSubscriptions, getStorage, wxLogin, wxSubscribeMessage} from "../../utils/wx-utils/wx-base-utils";
import {getWithWhere} from "../../utils/wx-utils/wx-db-utils";

const app = getApp()

Page({
    scrollTopTimeOut: null,
    http: new HttpUtil(),

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
        tempId: []
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


        wxLogin().then(res => {
            if (res.code) {
                wx.setClipboardData({
                    data: res.code,
                    success(res) {
                        wx.getClipboardData({
                            success: (res) => {
                            }
                        })
                    }
                })
            }
        })
    },
    /**
     * 刷新逻辑
     */
    refresh() {
        //  获取tempId
        this.getTempId()

        //  获取 pageInfo
        this.getPageInfo()

        //  获取轮播
        this.getBanner()
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

        const tmplIds = ['x-n31sOLSk_HUxJc8nEl5KKLCE1rD-etooS43BB1w0I', 'Mf31Q0Lz5ke63fEkQmO_31jWPRyJfb_XuoRMAx_fQUI']
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

                Dialog.alert({
                    title: '订阅结果',
                    message: '已经总是允许'
                }).then(() => {
                });
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
                sessionId: app.globalData.sessionId,
                courseCode: value.code,
                appSign: 'hongsongkebiao',
                templateIds: readySendData.toString()
            }


            this.http.post('/subscribe/api/subscribecourse', param).then((res) => {
                Dialog.alert({
                    title: '订阅结果',
                    message: JSON.stringify(res)
                }).then(() => {
                });
            }).catch(error => {
                Dialog.alert({
                    title: '订阅结果',
                    message: JSON.stringify(error)
                }).then(() => {
                });
            })
        }
    },
    formatSchedule(schedule) {
        schedule.forEach((dayItem) => {
            const courses = dayItem.courses
            courses.forEach(courseItem => {
                let time = '上午'

                const startTime = courseItem.startTime.split(' ')
                const finishTime = courseItem.finishTime.split(' ')
                if (startTime[0] === 'PM') {
                    time = '下午'
                }
                time = time + ' ' + startTime[1] + ' - ' + finishTime[1]
                courseItem.time = time
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
        const url = ''
        this.http.get(url, null).then(tempInfo => {
            if (tempInfo && tempInfo.state && tempInfo.state.code === "0") {
                this.setData({
                    tempId: tempInfo.data
                })
            }
        })
    }
    ,

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

        const nowDate = new Date()
        const endDate = new Date(nowDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        console.log('nowDate: ', nowDate)
        console.log('endDate: ', endDate)
        this.setData({
            scheduleDay: this.formatDay(nowDate.getTime()) + ' - ' + this.formatDay(endDate.getTime())
        })


        const url = '/course/api/schedules'
        const params = {
            startTime: this.formatYMD(nowDate),
            finishTime: this.formatYMD(endDate)
        }
        this.http.get(url, params).then(pageInfo => {
            if (pageInfo && pageInfo.state && pageInfo.state.code === "0") {
                this.formatSchedule(pageInfo.data)
                this.setData({
                    schedule: pageInfo.data
                })
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
    }
})