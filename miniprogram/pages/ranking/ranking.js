import {socilColorList} from "../../style/color-palette/social-color";
import {FansService} from "../../service/fansService";

const fansService = new FansService()

let bgColor = socilColorList[0]
let postCode = ''

Page({

    /**
     * 页面的初始数据
     */
    data: {
        fansList: []
    },

    refresh(postCodeData) {
        this.refreshFans(postCodeData)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const bgColorTemp = options.bgColor
        const postCodeTemp = options.postCode
        if (bgColorTemp) {
            bgColor = bgColorTemp
        }

        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: bgColor
        })

        if (postCodeTemp) {
            postCode = postCodeTemp
            this.refresh(postCode)
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

    refreshFans(postCodeData) {
        fansService.queryFans(postCodeData, 50).then(res => {
            this.setData({
                fansList: res
            })
        }).catch(() => {})
    }
})