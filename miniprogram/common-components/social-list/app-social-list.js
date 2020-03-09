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
        showList: true,
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
            this.triggerEvent('overlayShowEvent')
        }
    }
})
