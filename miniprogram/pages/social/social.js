// pages/social/social.js
import {getOnlineFile, getSetting, getUserInfo} from "../../utils/wx-utils/wx-base-utils";
import ImageSynthesis from "../../utils/image-utils/image-synthesis";
import {UserBase} from "../../utils/user-utils/user-base";
import {HttpUtil} from "../../utils/http-utils/http-util";
import {isSessionReady} from "../../utils/user-utils/user-base-utils";
import {socilColorList} from "../../color-palette/social-color";
import {formatTime} from "../../utils/time-utils/time-utils";
import Toast from '@vant/weapp/toast/toast';

const userBase = new UserBase()
const http = new HttpUtil()
let addLoding = false

Page({

    /**
     * 页面的初始数据
     */
    data: {
        bgColor: socilColorList[0],
        socialData: {},
        socialList: [],
        postCode: '',
        posterSrc: null,
        show: false,
        scopeRes: false,
        teacher: '',
        cardImgUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const bgColor = options.bgColor
        const postCode = options.postCode
        if (bgColor) {
            this.setData({
                bgColor: bgColor
            })
        }
        if (postCode) {
            this.setData({
                postCode: postCode
            })
            isSessionReady().then(res => {
                if (res) {
                    //  初始化头部
                    this.setCallTeacher(postCode)

                    //  初始化 list
                    this.setDataList(postCode)
                } else {
                    // 获取 sessionId 失败
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // const query = this.createSelectorQuery();
        // const id = '#social-list'
        // setTimeout(() => {
        //     query.select(id).boundingClientRect(rect => {
        //         // console.log('DOM: ', rect)
        //     }).exec();
        // }, 5000)
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
        if (!addLoding) {
            addLoding = true
            const seqno = this.data.socialList[this.data.socialList.length - 1].seqno
            this.addDataList(this.data.postCode, seqno)
        }
    },

    updateList() {
        this.setDataList(this.data.postCode)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.data.socialData.title,
            path: `pages/social/social?postCode=${this.data.postCode}`,
            success: () => {
                wx.showShareMenu({
                    withShareTicket: true
                })
            }
        }
    },

    onOverlayShowEvent() {
        this.setData({ show: true });
        //  初始化头部
        this.setCallTeacher(this.data.postCode, false)
    },

    OnoverlayShowEventWithInfo(event) {

        this.toastStart()

        const user = event.detail

        const userImgUrl = user.userImgUrl
        const nickname = user.nickname
        this.posterToReady(userImgUrl, nickname)
        this.setData({
            show: true
        })
        //  初始化头部
        this.setCallTeacher(this.data.postCode, false)
    },

    onClickHide() {
        this.setData({ show: false });
    },

    noop() {},

    savePoster() {
        wx.saveImageToPhotosAlbum({
            filePath: this.data.posterSrc,
            success: res => {
                wx.showModal({
                    content: '保存成功',
                    showCancel: false
                })
            },
            fail: err => {
                wx.showModal({
                    content: '保存失败，请在小程序设置中打开相册权限',
                    showCancel: false
                })
            }
        })
    },

    setCallTeacher(postCode, initPoster = true) {
        const url = '/forum/api/querypostbycode'
        const params = {
            postCode: postCode
        }
        http.get(url, params, userBase.getGlobalData().sessionId).then(res => {
            if (res && res.state && res.state.code === '0') {
                this.formatData(res.data)
                if (initPoster) {
                    this.initPoster(res.data)
                }
            }
        })
    },

    initPoster(info) {


        const teacher = info.authorName
        const cardImgUrl = info.imgUrl
        this.setData({
            teacher: teacher,
            cardImgUrl: cardImgUrl
        })

        getSetting('scope.userInfo').then(scopeRes => {
            if (scopeRes) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                getUserInfo().then(userInfo => {
                    this.setData({
                        scopeRes: true
                    })
                    // 获取用户信息成功
                    const user = userInfo.userInfo
                    const userImgUrl = user.avatarUrl
                    const nickname = user.nickName
                    this.posterToReady(userImgUrl, nickname)


                })
            } else {
                this.setData({
                    scopeRes: false
                })
            }
        })
    },

    posterToReady(userImgUrl, nickname) {

        const teacher = this.data.teacher
        const cardImgUrl = this.data.cardImgUrl

        Promise.all([getOnlineFile(userImgUrl), getOnlineFile(cardImgUrl)]).then(([userImgRes, cardImgRes]) => {


            const userImgPath = userImgRes.tempFilePath;
            const cardImgPath = cardImgRes.tempFilePath;
            console.log(userImgPath)
            console.log(cardImgPath)
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
                text: nickname,
                x: 150,
                y: 58,
                fontSize: 32,
                color: (() => '#070707')(),
            }).addText({
                text: '觉得' + teacher + '真的很棒',
                x: 50,
                y: 252,
                fontSize: 32,
                color: (() => '#070707')(),
            }).addText({
                text: '你也来和我一起学习吧！',
                x: 50,
                y: 300,
                fontSize: 32,
                color: (() => '#070707')(),
            }).startCompound((imgurl) => {
                this.setData({
                    posterSrc: imgurl
                });
                Toast.clear()
            });
        })
    },

    toastStart() {
        Toast.loading({
            mask: true,
            message: '海报生成中...',
            duration: 0,
        });
    },

    formatData(data) {
        const userImgList = []
        data.replyers.forEach(replyerItem => {
            if (userImgList.length < 4 && replyerItem.avatar) {
                if (!(userImgList.indexOf(replyerItem.avatar) > -1)) {
                    userImgList.push(replyerItem.avatar)
                }
            }
        })

        const socialData = {
            ...data,
            des: `已有 ${data.replyCnt} 人为老师点赞`,
            userImgList: userImgList
        }

        this.setData({
            socialData: socialData
        })
    },

    addDataList(postCode, seqno) {
        const url = '/forum/api/queryreply'
        const params = {
            postCode: postCode,
            loadType: 1,
            seqno: seqno

        }
        http.get(url, params, userBase.getGlobalData().sessionId).then(res => {
            addLoding = false
            if (res && res.state && res.state.code === '0') {
                this.formatSocialListData(res.data)
                this.setData({
                    socialList: [...this.data.socialList, ...res.data]
                })
            }
        }).catch(err => {
            addLoding = false
        })
    },

    setDataList(postCode) {
        const url = '/forum/api/queryreply'
        const params = {
            postCode: postCode,
            loadType: 0
        }
        http.get(url, params, userBase.getGlobalData().sessionId).then(res => {
            if (res && res.state && res.state.code === '0') {
                this.formatSocialListData(res.data)
                this.setData({
                    socialList: res.data
                })
            }
        })
    },

    formatSocialListData(data) {
        data.forEach(item => {
            const time = item.time
            item.createTime = formatTime(time)
            item.userImg = item.authorAvatar
            item.userName = item.authorName
            item.callNumber = `已点赞 ${item.cnt} 次`
            item.callDes = item.content
        })
    }
})