import {formatTime} from "../../../../utils/time-utils/time-utils";
import {getWithWhere} from "../../../../utils/wx-utils/wx-db-utils";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        bgColor: {
            type: String,
            value: ''
        },
        postCode: {
            type: String,
            value: ''
        },
        socialList: {
            type: Array,
            value: []
        },
        socialData: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        joininShow: false,
        tipData: {}
    },

    lifetimes: {
        attached() {
            getWithWhere('inReview', {
                position: 'socialInfo'
            }).then(socialInfoList => {
                if (socialInfoList.length) {
                    const socialInfo = socialInfoList[0]
                    const tipData = {
                        userImg: socialInfo.userImg,
                        userName: socialInfo.userName,
                        createTime: socialInfo.createTime,
                        callDes: socialInfo.callDes
                    }

                    this.setData({
                        tipData: tipData,
                        joininShow: socialInfo.show
                    });
                }
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        formatData(data) {
            data.forEach(item => {
                const time = item.time
                item.createTime = formatTime(time)
                item.userImg = item.authorAvatar
                item.userName = item.authorName
                item.callNumber = `已点赞 ${item.cnt} 次`
                item.callDes = item.content
            })
            this.setData({
                socialList: data
            })
        }
    }
})
