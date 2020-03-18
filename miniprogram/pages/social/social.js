import {
    getOnlineFile,
    getSetting,
    getStorage,
    getUserInfo,
    pageJump,
    saveImg
} from "../../utils/wx-utils/wx-base-utils";
import ImageSynthesis from "../../utils/image-utils/image-synthesis";
import {socilColorList} from "../../style/color-palette/social-color";
import {debounceForFunction, formatTime} from "../../utils/time-utils/time-utils";
import Toast from '@vant/weapp/toast/toast';
import {SocialService} from "./service/socialService";
import {UserBase} from "../../utils/user-utils/user-base";
import {FansService} from "../../service/fansService";
import {getWithWhere} from "../../utils/wx-utils/wx-db-utils";

const socialService = new SocialService()
const fansService = new FansService()
const userBase = new UserBase()

let addLoding = false
let teacherData = ''
let cardImgUrlData = ''
let socialListAll = []
let socialListQuestion = []

Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: -1,
        bgColor: socilColorList[0],
        socialData: {},
        showSheet: false,
        socialList: [],
        tagList: [
            {
                text: '查看全部',
                active: true
            },
            {
                text: '只看提问',
                active: false
            }
        ],
        fansList: [],
        postCode: '',
        posterSrc: null,
        show: false,
        scopeRes: false,
        showCallTeacherSheet: false,
        userSelectList: [],
        showCallGurid: false,
        tipShow: false,
        list: [
            {
                "text": "提问",
                "iconPath": "/images/Q&A.png",
                "page": "social",
                "w": "36rpx",
                "h": "36rpx",
                "mb": "10rpx"
            },
            {
                "text": "感谢老师",
                "bgColor": socilColorList[0],
                "page": "social"
            },
            {
                "text": "看视频",
                "iconPath": "/images/look-vlog.png",
                "page": "social",
                "w": "36rpx",
                "h": "27rpx",
                "mb": "19rpx"
            }
        ],
    },

    /**
     * 刷新页面
     */
    refresh(postCode) {
        this.refreshCardAndPoster(postCode)

        //  list 内容刷新
        this.refreshListContent(postCode)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const bgColor = options.bgColor
        const postCode = options.postCode
        const uid = options.uid
        if (bgColor) {
            const list = this.data.list
            list[1].bgColor = bgColor
            this.setData({
                bgColor: bgColor,
                list: list
            })
        }
        if (postCode) {
            this.setData({
                postCode: postCode
            })
            this.refresh(postCode)
        }
        if (uid) {
            socialService.invited(uid, postCode).then(() => {
            }).catch(() => {
            })
        }
        getStorage('tipShow').then(() => {}).catch(() => {
            this.setData({
                tipShow: true
            })
        })
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        socialService.recordAction()
        let path = ''
        if (this.data.postCode) {
            path = `pages/social/social?postCode=${this.data.postCode}&uid=${userBase.getGlobalData().userId}`
        }
        return {
            title: this.data.socialData.title,
            path: path,
            success: () => {
                wx.showShareMenu({
                    withShareTicket: true
                })
            }
        }
    },

    onOverlayShowEvent() {
        this.setData({
            show: true,
            showCallTeacherSheet: false
        });
        this.refreshHeaderAndList()
    },

    OnoverlayShowEventWithInfo(event) {
        this.setData({
            showCallTeacherSheet: false
        })

        this.toastStart()

        const user = event.detail

        const userImgUrl = user.userImgUrl
        const nickname = user.nickname

        this.setScopeRes(true)
        this.posterToReady(userImgUrl, nickname)

        this.setData({
            show: true
        })

        this.refreshHeaderAndList()
    },

    OnCallErrorEvent() {
        this.setData({
            showCallTeacherSheet: false,
            showCallGurid: true
        })
    },

    onClickHide() {
        this.setData({show: false});
    },

    noop() {
    },

    savePoster() {
        saveImg(this.data.posterSrc).then(() => {
            wx.showModal({
                content: '保存成功',
                showCancel: false
            })
        }).catch((err) => {
            wx.showModal({
                content: '保存失败，请在小程序设置中打开相册权限',
                showCancel: false
            })
        })
    },

    posterToReady(userImgUrl, nickname) {

        const teacher = teacherData
        const cardImgUrl = cardImgUrlData

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
        socialService.querySocialList(postCode, 1, seqno).then(res => {
            addLoding = false
            this.formatSocialListData(res)
            this.setData({
                socialList: [...this.data.socialList, ...res]
            })
        }).catch(() => {
            addLoding = false
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
    },

    /**
     * 刷新海报
     */
    refreshPoster(info) {
        const teacher = info.authorName
        const cardImgUrl = info.imgUrl
        teacherData = teacher
        cardImgUrlData = cardImgUrl

        getSetting('scope.userInfo').then(scopeRes => {
            if (scopeRes) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                getUserInfo().then(userInfo => {
                    const user = userInfo.userInfo
                    const userImgUrl = user.avatarUrl
                    const nickname = user.nickName
                    if (user && userImgUrl && nickname) {
                        this.setScopeRes(true)
                        this.posterToReady(userImgUrl, nickname)
                    } else {
                        this.setScopeRes(false)
                    }
                }).catch(() => {
                    //  获取用户信息失败
                    this.setScopeRes(false)
                })
            } else {
                //  获取用户信息失败
                this.setScopeRes(false)
            }
        }).catch(() => {
            //  获取用户信息失败
            this.setScopeRes(false)
        })
    },

    refreshUserSelect(authorName) {
        getWithWhere('userSelectDefault', {userName: authorName}).then(selectList => {
            if (selectList.length) {
                const selectDefaultList = JSON.parse(selectList[0].selectList)
                this.setData({
                    userSelectList: selectDefaultList
                })
            }
        })
    },

    /**
     * 刷新卡片
     */
    refreshCard(data) {
        this.formatData(data)
    },

    /**
     * 刷新头部和 list
     */
    refreshHeaderAndList() {
        this.refreshCardAndPoster(this.data.postCode, false)
        this.refreshListContent(this.data.postCode)
    },

    /**
     * 刷新卡片和海报
     */
    refreshCardAndPoster(postCode, refreshPoster = true) {
        socialService.queryInfoByCode(postCode).then(res => {
            //  海报拉取
            if (refreshPoster) {
                this.refreshPoster(res)
            }

            //  头部卡页刷新
            this.refreshCard(res)

            //  刷新默认话术
            this.refreshUserSelect(res.authorName)
        }).catch(() => {
        })
        //  刷新铁粉
        this.refreshFans(postCode)
    },

    refreshFans(postCode) {
        fansService.queryFans(postCode).then(res => {
            this.setData({
                fansList: res
            })
        }).catch(() => {
        })
    },

    /**
     * 刷新 list 内容
     */
    refreshListContent(postCode) {
        socialService.querySocialList(postCode).then(res => {
            this.formatSocialListData(res)
            this.setData({
                socialList: res
            })
        }).catch(() => {
        })
    },

    /**
     * 设置授权状态
     */
    setScopeRes(status) {
        this.setData({
            scopeRes: status
        })
    },

    onShowSheet() {
        this.setData({showSheet: true});
    },

    onCloseSheet() {
        this.setData({showSheet: false});
    },

    onShowCallTeacherSheetEvent() {
        this.onShowCallTeacherSheet()
    },

    onShowCallTeacherSheet() {
        this.setData({
            showCallTeacherSheet: true
        });
    },

    onCloseCallTeacherSheet() {
        this.setData({
            showCallTeacherSheet: false
        });
    },

    tabChange(event) {
        if (debounceForFunction()) {
            this.setData({
                active: -1
            })
            return;
        }
        const index = event.detail.index
        switch (index) {
            case 0: {
                const url = `../question/question?bgColor=${this.data.bgColor}&postCode=${this.data.postCode}`
                pageJump(url).then(() => {}).catch(() => {})
                break
            }
            case 1: {
                this.hiddenTip()
                break
            }
            case 2: {
                this.hiddenTip()
                let path = ''
                if (this.data.socialData.authorVlog) {
                    path = this.data.socialData.authorVlog
                }

                wx.navigateToMiniProgram({
                    appId: 'wxbe86c353682cdb84',
                    path: path,
                    success() {}
                })
                break
            }
        }
        this.setData({
            active: -1
        })
    },
    hiddenTip() {
        this.setData({
            tipShow: false
        })
        wx.setStorage({
            key:"tipShow",
            data: true
        })
    },

    selectedTag(event) {
        const selectedIndex = event.currentTarget.dataset.value
        const tagList = this.data.tagList
        tagList.forEach((item, index) => {
            item.active = index === selectedIndex
        })
        this.setData({
            tagList: tagList
        })
    }
})