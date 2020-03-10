// pages/test/test.js
import ImageSynthesis from "../../utils/image-utils/image-synthesis";
import {getOnlineFile} from "../../utils/wx-utils/wx-base-utils";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        posterSrc: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

        const userImgUrl = 'https://6873-hs-class-schedule-we-8wofx-1301353511.tcb.qcloud.la/user-img-test1.jpeg?sign=02834d465532aa8b032e0e0151bc7692&t=1583580234'
        const cardImgUrl = 'https://6873-hs-class-schedule-we-8wofx-1301353511.tcb.qcloud.la/card-img.png?sign=526a676fa60625ec801e5bfeff3cddcc&t=1583584004'


        Promise.all([getOnlineFile(userImgUrl), getOnlineFile(cardImgUrl)]).then(([userImgRes, cardImgRes]) => {
            const userImgPath = userImgRes.tempFilePath;
            const cardImgPath = cardImgRes.tempFilePath;
            const width = 588;
            const height = 890;
            const imageSynthesis = new ImageSynthesis(this, 'festivalCanvas', width, height);
            imageSynthesis.addImage({
                path: '../../images/poster.png',
                x: 0,
                y: 0,
                w: 588,
                h: 890
            }).addImage({
                path: userImgPath,
                x: 50,
                y: 39,
                w: 82,
                h: 82,
                radius: 50,
            }).addImage({
                path: cardImgPath,
                x: 50,
                y: 372,
                w: 488,
                h: 276,
            }).addText({
                text: '阿花',
                x: 150,
                y: 37,
                fontSize: 32,
                color: (() => '#070707')(),
            }).addText({
                text: '已点赞 27 次',
                x: 150,
                y: 80,
                fontSize: 28,
                color: (() => '#C5C4C4')(),
            }).addText({
                text: '觉得高松老师真的很棒，你也来和',
                x: 50,
                y: 252,
                fontSize: 32,
                color: (() => '#070707')(),
            }).addText({
                text: '我一起学习吧！',
                x: 50,
                y: 300,
                fontSize: 32,
                color: (() => '#070707')(),
            }).startCompound((imgurl) => {
                this.setData({
                    posterSrc: imgurl,
                });
            });
        })
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

    }
})