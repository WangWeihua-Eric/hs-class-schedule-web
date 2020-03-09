import {UserBase} from "../../utils/user-utils/user-base";
import {HttpUtil} from "../../utils/http-utils/http-util";
import {isSessionReady} from "../../utils/user-utils/user-base-utils";

const userBase = new UserBase()
const http = new HttpUtil()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        bgColor: {
            type: String,
            value: ''
        },
        socialData: {
            type: Object,
            value: {}
        },
        arrow: {
            type: Boolean,
            value: false
        },
        postCode: {
            type: String,
            value: ''
        }
    },

    observers: {
        'postCode': function(postCode) {
            if (postCode) {
                isSessionReady().then(res => {
                    if (res) {
                        this.refresh(postCode)
                    } else {
                        // 获取 sessionId 失败
                    }
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        refresh(postCode) {
            const url = '/forum/api/querypostbycode'
            const params = {
                postCode: postCode
            }
            http.get(url, params, userBase.getGlobalData().sessionId).then(res => {
                console.log('postRes: ', res)
            })
        }
    }
})
