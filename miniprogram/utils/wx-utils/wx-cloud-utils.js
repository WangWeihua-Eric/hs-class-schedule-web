export function login() {
    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                resolve(res)
            },
            fail: error => {
                reject(error)
            }
        })
    })
}

export function http(url, param, method, header = {'content-type': 'application/json'}) {
    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            name: 'http',
            data: {
                url: url,
                param: param,
                method: method,
                header: header
            },
            success: res => {
                resolve(res)
            },
            fail: error => {
                reject(error)
            }
        })
    })
}