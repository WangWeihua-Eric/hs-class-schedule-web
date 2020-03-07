// common-components/social-list/app-social-list.js
import {getOnlineFile} from "../../utils/wx-utils/wx-base-utils";
import ImageSynthesis from "../../utils/image-utils/image-synthesis";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        bgColor: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        show: false,
        showList: true,
        posterSrc: null,
        socialList: [{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        },{
            userImg: 'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
            userName: '阿花',
            createTime: '今天 9:34',
            callNumber: '已打卡 27 次',
            callDes: '给高松老师比心！老师辛苦啦！'
        }]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClickShow() {
            this.setData({ show: true });



            const userImgUrl = 'https://6873-hs-class-schedule-we-8wofx-1301353511.tcb.qcloud.la/user-img-test1.jpeg?sign=02834d465532aa8b032e0e0151bc7692&t=1583580234'
            const cardImgUrl = 'https://6873-hs-class-schedule-we-8wofx-1301353511.tcb.qcloud.la/card-img.png?sign=526a676fa60625ec801e5bfeff3cddcc&t=1583584004'


            Promise.all([getOnlineFile(userImgUrl), getOnlineFile(cardImgUrl)]).then(([userImgRes, cardImgRes]) => {
                const userImgPath = userImgRes.tempFilePath;
                const cardImgPath = cardImgRes.tempFilePath;
                const width = 588;
                const height = 890;
                const imageSynthesis = new ImageSynthesis(this, 'festivalCanvas', width, height);
                console.log(imageSynthesis)
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
                    text: '已打卡 27 次',
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
                    console.log('112121: ', imgurl)
                    this.setData({
                        posterSrc: imgurl,
                    });
                });
            })
        },

        onClickHide() {
            this.setData({ show: false });
        },

        noop() {}
    }
})
