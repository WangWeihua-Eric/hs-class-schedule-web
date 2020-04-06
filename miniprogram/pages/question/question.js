import {socilColorList} from "../../style/color-palette/social-color";
import {FansService} from "../../service/fansService";
import {CosService} from "../../utils/cos-utils/cosService/cosService";
import {UserBase} from "../../utils/user-utils/user-base";
import {writeFile} from "../../utils/wx-utils/wx-base-utils";
import Toast from '@vant/weapp/toast/toast';

const fansService = new FansService()
const cosService = new CosService()
const userBase = new UserBase()

let valueTemp = ''
let postCode = ''
let replyType = 2

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
        const type = options.type
        switch (type) {
            case 'question': {
                replyType = 2
                break
            }
            case 'homework': {
                replyType = 3
                break
            }
        }

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
        const fileList = this.data.fileList
        if (fileList && fileList.length) {
            Toast.loading({
                message: '发布中...'
            });
            this.contentWithImg(fileList)
        } else {
            this.normalContent()
        }
    },

    normalContent() {
        if (valueTemp && valueTemp.length) {
            const params = {
                postCode: postCode,
                contentType: 1,
                replyType: replyType,
                content: valueTemp
            }

            fansService.callTeacher(params).then(res => {
                wx.showModal({
                    title: '发布成功',
                    content: '老师将在一天内查看!',
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

    contentWithImg(fileList) {
        const filePaths = []
        const textPath = `${wx.env.USER_DATA_PATH}/question.txt`
        if (valueTemp) {
            filePaths.push(textPath)
            writeFile(textPath, valueTemp).then(() => {
                this.readySend(filePaths, fileList)
            }).catch(() => {
                Toast.clear()
                wx.showModal({
                    content: '上传失败',
                    showCancel: false
                })
            })
        } else {
            this.readySend(filePaths, fileList)
        }
    },
    readySend(filePaths, fileList) {
        fileList.forEach(item => {
            filePaths.push(item.path)
        })

        const ext = {
            replyType: replyType,
            postCode: postCode
        }
        cosService.uploadFiles(userBase.getGlobalData().sessionId, filePaths, '/forum/api/multipostreply', ext).then(res => {
            Toast.clear()
            wx.showModal({
                title: '发布成功',
                content: '老师将在一天内查看!',
                showCancel: false,
                success: (res) => {
                    valueTemp = ''
                    if (res.confirm) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            })
        }).catch(err => {
            Toast.clear()
            wx.showModal({
                content: '上传失败',
                showCancel: false
            })
        })
    },

    onInputEvent(event) {
        const inputValue = event.detail
        valueTemp = inputValue
    }
})