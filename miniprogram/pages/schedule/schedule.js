// pages/schedule/schedule.js
import {HttpUtil} from "../../utils/http-utils/http-util";
import Dialog from '@vant/weapp/dialog/dialog';

Page({
    scrollTopTimeOut: null,
    http: new HttpUtil(),

    /**
     * 页面的初始数据
     */
    data: {
        indexList: [],
        showShareBtn: true,
        schedule: [
            {
                "group": {
                    "weekday": "周日",
                    "date": "2020-02-24T04:00:00.000+0000"
                },
                "courses": [
                    {
                        "code": "c000002",
                        "title": "遮瑕减龄粉底妆",
                        "startTime": "2020-02-24T04:00:00.000+0000",
                        "finishTime": "2020-02-24T04:45:00.000+0000",
                        "category": {
                            "name": "美妆",
                            "color": "rgba(248,97,97,1)"
                        },
                        "lecturer": {
                            "name": "天池老师",
                            "code": "lec000001",
                            "titles": "中央电视台化妆师"
                        }
                    }
                ]
            },
            {
                "group": {
                    "weekday": "周六",
                    "date": "2020-02-22T17:00:00.000+0000"
                },
                "courses": [
                    {
                        "code": "c000001",
                        "title": "小仙女们学修眉",
                        "startTime": "2020-02-22T17:00:00.000+0000",
                        "finishTime": "2020-02-22T17:45:00.000+0000",
                        "category": {
                            "name": "美妆",
                            "color": "rgba(248,97,97,1)"
                        },
                        "lecturer": {
                            "name": "天池老师",
                            "code": "lec000001",
                            "titles": "中央电视台化妆师"
                        }
                    },
                    {
                        "code": "c000003",
                        "title": "远离【三高】我有绝招",
                        "startTime": "2020-02-22T16:00:00.000+0000",
                        "finishTime": "2020-02-22T16:45:00.000+0000",
                        "category": {
                            "name": "健康",
                            "color": "rgba(71,172,78,1)"
                        },
                        "lecturer": {
                            "name": "孝文老师",
                            "code": "lec000002",
                            "titles": "中央电视健康之路运动嘉宾"
                        }
                    }
                ]
            },
            {
                "group": {
                    "weekday": "周六",
                    "date": "2020-02-22T17:00:00.000+0000"
                },
                "courses": [
                    {
                        "code": "c000001",
                        "title": "小仙女们学修眉",
                        "startTime": "2020-02-22T17:00:00.000+0000",
                        "finishTime": "2020-02-22T17:45:00.000+0000",
                        "category": {
                            "name": "美妆",
                            "color": "rgba(248,97,97,1)"
                        },
                        "lecturer": {
                            "name": "天池老师",
                            "code": "lec000001",
                            "titles": "中央电视台化妆师"
                        }
                    },
                    {
                        "code": "c000003",
                        "title": "远离【三高】我有绝招",
                        "startTime": "2020-02-22T16:00:00.000+0000",
                        "finishTime": "2020-02-22T16:45:00.000+0000",
                        "category": {
                            "name": "健康",
                            "color": "rgba(71,172,78,1)"
                        },
                        "lecturer": {
                            "name": "孝文老师",
                            "code": "lec000002",
                            "titles": "中央电视健康之路运动嘉宾"
                        }
                    }
                ]
            },
            {
                "group": {
                    "weekday": "周六",
                    "date": "2020-02-22T17:00:00.000+0000"
                },
                "courses": [
                    {
                        "code": "c000001",
                        "title": "小仙女们学修眉",
                        "startTime": "2020-02-22T17:00:00.000+0000",
                        "finishTime": "2020-02-22T17:45:00.000+0000",
                        "category": {
                            "name": "美妆",
                            "color": "rgba(248,97,97,1)"
                        },
                        "lecturer": {
                            "name": "天池老师",
                            "code": "lec000001",
                            "titles": "中央电视台化妆师"
                        }
                    },
                    {
                        "code": "c000003",
                        "title": "远离【三高】我有绝招",
                        "startTime": "2020-02-22T16:00:00.000+0000",
                        "finishTime": "2020-02-22T16:45:00.000+0000",
                        "category": {
                            "name": "健康",
                            "color": "rgba(71,172,78,1)"
                        },
                        "lecturer": {
                            "name": "孝文老师",
                            "code": "lec000002",
                            "titles": "中央电视健康之路运动嘉宾"
                        }
                    }
                ]
            },
            {
                "group": {
                    "weekday": "周六",
                    "date": "2020-02-22T17:00:00.000+0000"
                },
                "courses": [
                    {
                        "code": "c000001",
                        "title": "小仙女们学修眉",
                        "startTime": "2020-02-22T17:00:00.000+0000",
                        "finishTime": "2020-02-22T17:45:00.000+0000",
                        "category": {
                            "name": "美妆",
                            "color": "rgba(248,97,97,1)"
                        },
                        "lecturer": {
                            "name": "天池老师",
                            "code": "lec000001",
                            "titles": "中央电视台化妆师"
                        }
                    },
                    {
                        "code": "c000003",
                        "title": "远离【三高】我有绝招",
                        "startTime": "2020-02-22T16:00:00.000+0000",
                        "finishTime": "2020-02-22T16:45:00.000+0000",
                        "category": {
                            "name": "健康",
                            "color": "rgba(71,172,78,1)"
                        },
                        "lecturer": {
                            "name": "孝文老师",
                            "code": "lec000002",
                            "titles": "中央电视健康之路运动嘉宾"
                        }
                    }
                ]
            },
            {
                "group": {
                    "weekday": "周六",
                    "date": "2020-02-22T17:00:00.000+0000"
                },
                "courses": [
                    {
                        "code": "c000001",
                        "title": "小仙女们学修眉",
                        "startTime": "2020-02-22T17:00:00.000+0000",
                        "finishTime": "2020-02-22T17:45:00.000+0000",
                        "category": {
                            "name": "美妆",
                            "color": "rgba(248,97,97,1)"
                        },
                        "lecturer": {
                            "name": "天池老师",
                            "code": "lec000001",
                            "titles": "中央电视台化妆师"
                        }
                    },
                    {
                        "code": "c000003",
                        "title": "远离【三高】我有绝招",
                        "startTime": "2020-02-22T16:00:00.000+0000",
                        "finishTime": "2020-02-22T16:45:00.000+0000",
                        "category": {
                            "name": "健康",
                            "color": "rgba(71,172,78,1)"
                        },
                        "lecturer": {
                            "name": "孝文老师",
                            "code": "lec000002",
                            "titles": "中央电视健康之路运动嘉宾"
                        }
                    }
                ]
            },
            {
                "group": {
                    "weekday": "周六",
                    "date": "2020-02-22T17:00:00.000+0000"
                },
                "courses": [
                    {
                        "code": "c000001",
                        "title": "小仙女们学修眉",
                        "startTime": "2020-02-22T17:00:00.000+0000",
                        "finishTime": "2020-02-22T17:45:00.000+0000",
                        "category": {
                            "name": "美妆",
                            "color": "rgba(248,97,97,1)"
                        },
                        "lecturer": {
                            "name": "天池老师",
                            "code": "lec000001",
                            "titles": "中央电视台化妆师"
                        }
                    },
                    {
                        "code": "c000003",
                        "title": "远离【三高】我有绝招",
                        "startTime": "2020-02-22T16:00:00.000+0000",
                        "finishTime": "2020-02-22T16:45:00.000+0000",
                        "category": {
                            "name": "健康",
                            "color": "rgba(71,172,78,1)"
                        },
                        "lecturer": {
                            "name": "孝文老师",
                            "code": "lec000002",
                            "titles": "中央电视健康之路运动嘉宾"
                        }
                    }
                ]
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const url = 'https://douban.uieee.com/v2/movie/top250'
        this.http.get(url, null).then(pageInfo => {
            console.log('pageInfo1: ', pageInfo)
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

    },

    onPageScroll(event) {
        if (this.scrollTopTimeOut) {
            clearTimeout(this.scrollTopTimeOut);
        }
        this.scrollTopTimeOut = setTimeout(() =>{
            // 滑动停止的代码，此处半秒内位置不变即为滑动停止。
            this.setData({
                showShareBtn: true
            })
        }, 300);
        this.setData({
            scrollTop: event.scrollTop,
            showShareBtn: false
        });
    },

    onBooking(event, ownerInstance) {
        console.log('event', event)
        console.log('ownerInstance', ownerInstance)
        wx.requestSubscribeMessage({
            tmplIds: ['x-n31sOLSk_HUxJc8nEl5KKLCE1rD-etooS43BB1w0I','Mf31Q0Lz5ke63fEkQmO_31jWPRyJfb_XuoRMAx_fQUI'],
            success (res) {
                Dialog.alert({
                    title: '订阅回调',
                    message: JSON.stringify(res)
                }).then(() => {});
            },
            fail: error => {
                console.log('error: ', error)
                Dialog.alert({
                    title: '订阅出错',
                    message: JSON.stringify(error)
                }).then(() => {});
            }
        })
    }
})