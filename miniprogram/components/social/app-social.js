// components/social/app-social.js
import {socilColorList} from "../../color-palette/social-color";
import {pageJump} from "../../utils/wx-utils/wx-base-utils";

Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        socilColors: socilColorList,
        socialDataList: [
            {
                title: '感谢你，高松老师',
                des: '已有 4333 人为老师点赞',
                userImgList: [
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test2.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test3.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test4.jpeg'
                ]
            },
            {
                title: '感谢你，天池老师',
                des: '已有 977 人为老师点赞',
                userImgList: [
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test2.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test3.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test4.jpeg'
                ]
            },
            {
                title: '感谢你，孝文老师',
                des: '已有 694 人为老师点赞',
                userImgList: [
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test2.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test3.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test4.jpeg'
                ]
            },
            {
                title: '感谢你，紫晶老师',
                des: '已有 631 人为老师点赞',
                userImgList: [
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test2.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test3.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test4.jpeg'
                ]
            },
            {
                title: '感谢你，高松老师',
                des: '已有 4333 人为老师点赞',
                userImgList: [
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test2.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test3.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test4.jpeg'
                ]
            },
            {
                title: '感谢你，高松老师',
                des: '已有 4333 人为老师点赞',
                userImgList: [
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test2.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test3.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test4.jpeg'
                ]
            },
            {
                title: '感谢你，高松老师',
                des: '已有 4333 人为老师点赞',
                userImgList: [
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test2.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test3.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test4.jpeg'
                ]
            },
            {
                title: '感谢你，高松老师',
                des: '已有 4333 人为老师点赞',
                userImgList: [
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test1.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test2.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test3.jpeg',
                    'cloud://hs-class-schedule-we-8wofx.6873-hs-class-schedule-we-8wofx-1301353511/user-img-test4.jpeg'
                ]
            }
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onJump(event) {
            const index = event.currentTarget.dataset.value
            if (index > -1) {
                const socialData = this.data.socialDataList[index]
                const bgColor = this.data.socilColors[index % 4]
                const url = `../../pages/social/social?socialData=${JSON.stringify(socialData)}&bgColor=${bgColor}`
                pageJump(url).then(() => {}).catch(() => {})
            }
        }
    }
})
