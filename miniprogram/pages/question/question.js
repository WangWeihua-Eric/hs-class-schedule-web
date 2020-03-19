import {socilColorList} from "../../style/color-palette/social-color";
import {FansService} from "../../service/fansService";

const fansService = new FansService()

let valueTemp = ''
let postCode = ''

Page({

    /**
     * 页面的初始数据
     */
    data: {
        focus: true,
        fileList: [],
        bgColor: socilColorList[0],
        value: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const bgColor = options.bgColor
        const postCodeTemp = options.postCode
        if (bgColor) {
            this.setData({
                bgColor: bgColor
            })
        }
        if (postCodeTemp) {
            postCode = postCodeTemp
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
            focus: true
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

    },

    afterRead(event) {
        const files = event.detail.file;
        files.forEach(item => {
            item['url'] = item.path
        })

        const fileList = [...this.data.fileList, ...files]
        this.setData({ fileList });
    },

    onDeleteEvent(event) {
        const deleteIndex = event.detail.index
        const fileList = this.data.fileList.filter((item, index) => index !== deleteIndex)
        this.setData({
            fileList: fileList
        })
    },

    onFocusEvent() {
        this.setData({
            focus: true
        })
    },

    nonp() {

    },

    onSendQuestion() {
        if (valueTemp && valueTemp.length) {
            const params = {
                postCode: postCode,
                contentType: 1,
                replyType: 2,
                content: valueTemp
            }

            fansService.callTeacher(params).then(res => {
                wx.showModal({
                    content: '提问成功，老师将在一天内帮您解答！',
                    showCancel: false,
                    success: (res) => {
                        if (res.confirm) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    }
                })
            }).catch(() => {
                wx.showModal({
                    content: '发布问题失败',
                    showCancel: false
                })
            })
        } else {
            wx.showModal({
                content: '请输入您想提的问题哦',
                showCancel: false
            })
        }
    },

    onInputEvent(event) {
        const inputValue = event.detail
        valueTemp = inputValue
    }
})