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
import {UserService} from "../../service/userService";

const socialService = new SocialService()
const fansService = new FansService()
const userBase = new UserBase()
const userService = new UserService()

let addLoding = false
let teacherData = ''
let cardImgUrlData = ''
let socialListAll = []
let socialListQuestion = []
let socialListWork = []
let socialListMe = []
let nowSelectIndex = 0

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
                text: '全部',
                active: true
            },
            {
                text: '看提问',
                active: false
            },
            {
                text: '看作业',
                active: false
            },
            {
                text: '我发布的',
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
                "iconPath": "/images/thx-text.png",
                "page": "social"
            },
            {
                "text": "提问/发作业",
                "bgColor": socilColorList[0],
                "page": "social"
            },
            {
                "iconPath": "/images/look-vlog.png",
                "page": "social"
            }
        ],
        showQuestion: false,
        actions: [
            {
                name: '提交作业'
            },
            {
                name: '我要提问'
            }
        ]
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
        const tagList = this.data.tagList
        tagList.forEach((item, index) => {
            item.active = index === nowSelectIndex
        })
        this.setData({
            tagList: tagList
        })
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
        getStorage('tipShow').then(() => {
        }).catch(() => {
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
        if (this.data.postCode) {
            this.refreshListContent(this.data.postCode)
        }
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
        let replyType = 0
        switch (nowSelectIndex) {
            case 1: {
                replyType = 2
                break
            }
            case 2: {
                replyType = 3
                break
            }
        }
        if (nowSelectIndex === 3) {
            socialService.querMyReply(postCode, 1, seqno).then(res => {
                addLoding = false
                this.formatSocialListData(res)
                this.setData({
                    socialList: [...this.data.socialList, ...res]
                })
                socialListMe = this.data.socialList
            }).catch(() => {})

        } else {
            socialService.querySocialList(postCode, 1, seqno, replyType).then(res => {
                addLoding = false
                this.formatSocialListData(res)
                this.setData({
                    socialList: [...this.data.socialList, ...res]
                })
                switch (nowSelectIndex) {
                    case 0: {
                        socialListAll = this.data.socialList
                        break;
                    }
                    case 1: {
                        socialListQuestion = this.data.socialList
                        break
                    }
                    case 2: {
                        socialListWork = this.data.socialList
                        break
                    }
                }
            }).catch(() => {
                addLoding = false
            })
        }
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

    refreshUserSelect(dataInfo) {
        getWithWhere('userSelectDefault', {userName: 'teacher'}).then(selectList => {
            if (selectList.length) {
                const selectDefaultList = JSON.parse(selectList[0].selectList)
                this.setData({
                    userSelectList: this.formatSelectList(selectDefaultList, dataInfo)
                })
            }
        })
    },

    /**
     * 格式化感谢话术
     */
    formatSelectList(selectDefaultList, dataInfo) {
        const authorName = dataInfo.authorName
        const courseName = dataInfo.courseName
        const list = []
        selectDefaultList.forEach(item => {
            list.push(item.replace('{0}', authorName).replace('{1}', courseName))
        })
        return list
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
            this.refreshUserSelect(res)
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
        this.refreshSocialListAll(postCode)
        this.refreshSocialListQuestion(postCode)
        this.refreshSocialListWork(postCode)
        this.refreshSocialListMe(postCode)
    },

    /**
     * 刷新全部 list
     */
    refreshSocialListAll(postCode) {
        socialService.querySocialList(postCode).then(res => {
            this.formatSocialListData(res)
            if (nowSelectIndex === 0) {
                this.setData({
                    socialList: res
                })
            }
            socialListAll = res
        }).catch(() => {
        })
    },

    /**
     * 刷新提问 list
     */
    refreshSocialListQuestion(postCode) {
        socialService.querySocialList(postCode, 0, 0, 2).then(res => {
            this.formatSocialListData(res)
            if (nowSelectIndex === 1) {
                this.setData({
                    socialList: res
                })
            }
            socialListQuestion = res
        }).catch(() => {
        })
    },

    /**
     * 刷新作业
     */
    refreshSocialListWork(postCode) {
        socialService.querySocialList(postCode, 0, 0, 3).then(res => {
            this.formatSocialListData(res)
            if (nowSelectIndex === 2) {
                this.setData({
                    socialList: res
                })
            }
            socialListWork = res
        }).catch(() => {
        })
    },

    /**
     * 刷新我的发布
     */
    refreshSocialListMe(postCode) {
        socialService.querMyReply(postCode).then(res => {
            this.formatSocialListData(res)
            if (nowSelectIndex === 3) {
                this.setData({
                    socialList: res
                })
            }
            socialListMe = res
        }).catch(() => {})
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
        this.callTeacher()
        // this.onShowCallTeacherSheet()
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
                this.hiddenTip()
                break
            }
            case 1: {
                this.setData({ showQuestion: true });
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
                    success() {
                    }
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
            key: "tipShow",
            data: true
        })
    },

    selectedTag(event) {
        const selectedIndex = event.currentTarget.dataset.value
        nowSelectIndex = selectedIndex
        const tagList = this.data.tagList
        tagList.forEach((item, index) => {
            item.active = index === selectedIndex
        })
        switch (selectedIndex) {
            case 0: {
                this.setData({
                    socialList: socialListAll,
                    tagList: tagList
                })
                break
            }
            case 1: {
                this.setData({
                    socialList: socialListQuestion,
                    tagList: tagList
                })
                break
            }
            case 2: {
                this.setData({
                    socialList: socialListWork,
                    tagList: tagList
                })
                break
            }
            case 3: {
                this.setData({
                    socialList: socialListMe,
                    tagList: tagList
                })
                break
            }
        }
    },

    onCloseQuestion() {
        this.setData({ showQuestion: false });
    },

    onSelectSheet(event) {
        console.log(event.detail);
        const typeName = event.detail.name

        let url = `../question/question?bgColor=${this.data.bgColor}&postCode=${this.data.postCode}`
        switch (typeName) {
            case '提交作业': {
                url = `${url}&type=homework`
                break
            }
            case '我要提问': {
                url = `${url}&type=question`
                break
            }
        }

        pageJump(url).then(() => {
        }).catch(() => {
        })
    },

    callTeacher() {
        let params = {
            postCode: this.data.postCode,
            contentType: 0
        }

        if (!this.data.scopeRes) {
            getSetting('scope.userInfo').then(scopeRes => {
                if (scopeRes) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    getUserInfo().then(userInfo => {
                        // 获取用户信息成功
                        const user = userInfo.userInfo
                        const userImgUrl = user.avatarUrl
                        const nickname = user.nickName
                        const param = {
                            userImgUrl: userImgUrl,
                            nickname: nickname
                        }

                        userService.userUpdate({
                            avatar: userImgUrl,
                            nickname: nickname
                        }).then(res => {
                            const user = {
                                ...res
                            }
                            userBase.setGlobalData(user)
                            fansService.callTeacher(params).then(() => {
                                wx.showModal({
                                    title: '谢谢您为老师点赞',
                                    content: '老师已经收到你的感谢啦！',
                                    showCancel: false
                                })
                            }).catch(err => {
                                if (err && err.state && err.state.code === '60001') {
                                    wx.showModal({
                                        content: '每天只能点赞两次哦',
                                        showCancel: false
                                    })
                                } else {
                                    wx.showModal({
                                        content: '点赞失败，请重试',
                                        showCancel: false
                                    })
                                }
                            })
                            wx.setStorage({
                                key: "sessionId",
                                data: {
                                    ...user,
                                    updateTime: new Date().getTime()
                                }
                            })
                        }).catch(() => {
                            wx.showModal({
                                content: '点赞失败，请重试',
                                showCancel: false
                            })
                        })
                    })
                } else {
                    wx.showModal({
                        content: '请同意授权用户信息',
                        showCancel: false
                    })
                }
            }).catch(() => {
                wx.showModal({
                    content: '请同意授权用户信息',
                    showCancel: false
                })
            })
        } else {
            fansService.callTeacher(params).then(() => {
                wx.showModal({
                    title: '谢谢您为老师点赞',
                    content: '老师已经收到你的感谢啦！',
                    showCancel: false
                })
            }).catch(err => {
                if (err && err.state && err.state.code === '60001') {
                    wx.showModal({
                        content: '每天只能点赞两次哦',
                        showCancel: false
                    })
                } else {
                    wx.showModal({
                        content: '点赞失败，请重试',
                        showCancel: false
                    })
                }
            })
        }
    }
})