// pages/schedule/schedule.js
import {HttpUtil} from "../../utils/http-utils/http-util";
import Dialog from '@vant/weapp/dialog/dialog';
import {getStorage, wxLogin, wxSubscribeMessage} from "../../utils/wx-utils/wx-base-utils";
import {getWithWhere} from "../../utils/wx-utils/wx-db-utils";

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
        guide: false
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

        const url = '/course/api/schedules'
        const params = {
            startTime: '2020-02-21',
            finishTime: '2020-02-28'
        }
        this.http.get(url, params).then(pageInfo => {
            if (pageInfo && pageInfo.state && pageInfo.state.code === "0") {
                this.formatSchedule(pageInfo.data)
                this.setData({
                    schedule: pageInfo.data
                })
            }
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        getWithWhere('scheduleDay', {type: 'scheduleTime'}).then(res => {
            if (res.length) {
                const scheduleTime = res[0]
                const startTime = scheduleTime.startTime
                const endTime = scheduleTime.endTime
                this.setData({
                    startTime: startTime,
                    endTime: endTime,
                    scheduleDay: this.formatDay(startTime) + ' - ' + this.formatDay(endTime)
                })
            }
        })

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
        const value = event.currentTarget.dataset.value

        this.setData({
            show: true
        })

        const tmplIds = ['x-n31sOLSk_HUxJc8nEl5KKLCE1rD-etooS43BB1w0I', 'Mf31Q0Lz5ke63fEkQmO_31jWPRyJfb_XuoRMAx_fQUI']

        wxSubscribeMessage(tmplIds).then(res => {
            Dialog.alert({
                title: '订阅回调',
                message: JSON.stringify(res)
            }).then(() => {
                this.setData({
                    show: false
                })

                const param = {
                    sessionId:'test',
                    courseCode:'c000001',
                    appSign:'hongsongkebiao',
                    templateId:'Mf31Q0Lz5ke63fEkQmO_31jWPRyJfb_XuoRMAx_fQUI'
                }
                this.http.post('/subscribe/api/subscribecourse', param).then(res => {
                    Dialog.alert({
                        title: 'res',
                        message: JSON.stringify(Date.parse(res))
                    }).then(() => {});
                })

            });
        }).catch(error => {
            // Dialog.alert({
            //     title: '订阅出错',
            //     message: JSON.stringify(error)
            // }).then(() => {
            //     this.setData({
            //         show: false
            //     })
            //
            //
            //
            //     // const param = {
            //     //     sessionId:'test',
            //     //     courseCode:'c000001',
            //     //     appSign:'hongsongkebiao',
            //     //     templateId:'Mf31Q0Lz5ke63fEkQmO_31jWPRyJfb_XuoRMAx_fQUI'
            //     // }
            //     // this.http.post('/subscribe/api/subscribecourse', param).then(res => {
            //     //     console.log(res);
            //     //     Dialog.alert({
            //     //         title: 'res',
            //     //         message: JSON.stringify(Date.parse(res))
            //     //     }).then(() => {});
            //     // })
            // });
        })
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
    },
    // formatDateTime(date) {
    //
    //     Dialog.alert({
    //         title: '时间转换',
    //         message: JSON.stringify(Date.parse(date))
    //     }).then(() => {});
    //
    //     let time = new Date(Date.parse(date));
    //     time.setTime(time.setHours(time.getHours() + 8));
    //
    //     let Y = time.getFullYear() + '-';
    //     let M = this.addZero(time.getMonth() + 1) + '-';
    //     let D = this.addZero(time.getDate()) + ' ';
    //     let h = this.addZero(time.getHours()) + ':';
    //     let m = this.addZero(time.getMinutes());
    //     let s = this.addZero(time.getSeconds());
    //     return Y + M + D + h + m;
    // },
    // 数字补0操作
    // addZero(num) {
    //     return num < 10 ? '0' + num : num;
    // },
    formatDay(timeTemp) {
        const date = new Date(parseInt(timeTemp))
        return date.getMonth() + '月' + date.getDate() + '日'
    },

    onClickShow() {
        this.setData({ show: true });
    },

    onClickHide() {
        this.setData({ show: false });
    },

    noop() {}
})