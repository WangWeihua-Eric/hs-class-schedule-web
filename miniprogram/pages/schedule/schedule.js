import {getStorage} from "../../utils/wx-utils/wx-base-utils";
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';

Page({
    scrollTopTimeOut: null,

    /**
     * 页面的初始数据
     */
    data: {
        guide: false,
        showShareBtn: true,
        scrollTop: null
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
    }
})