// 云函数入口文件
const cloud = require('wx-server-sdk')

//引入request-promise用于做网络请求
var rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const options = {
    uri: event.url,
    qs: event.param,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  return await rp(options)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    });
}