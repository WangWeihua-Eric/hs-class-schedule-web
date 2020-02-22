import {http} from "../wx-utils/wx-cloud-utils";

let singletonPattern = null;

export class HttpUtil {
    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this;
    }

    // post(url, param, header = {'content-type': 'application/json'}) {
    //     http(url, param, 'POST', header).then(res => {
    //         console.log(res)
    //     })
    // }

    get(url, param) {
        return http(url, param, 'GET').then(res => {
            return res.result
        })
    }
}