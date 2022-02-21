
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `https://api-visitor.gqgood.com/campus/mini-app/daily-learning/sign-up`;
const method = `POST`;
const headers = {
'Connection' : `keep-alive`,
'Accept-Encoding' : `gzip, deflate, br`,
'Content-Type' : `application/json;charset=UTF-8`,
'appId' : `wx911ab7f9d5bb5aa0`,
'Origin' : `https://g0006.gqgood.com`,
'authorizeMode' : ``,
'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.18(0x1800122a) NetType/WIFI Language/zh_CN`,
'platform' : `wechat-h5`,
'Host' : `api-visitor.gqgood.com`,
'Referer' : `https://g0006.gqgood.com/`,
'minitoken' : `oadZJ5hFyYA0zDfINK-MS9B95apg^^c14af34e4be51ce92bac514d3ecd59042405f503cb3e65f8cb62f1f1bf676a67`,
'Accept-Language' : `zh-CN,zh-Hans;q=0.9`,
'Accept' : `*/*`
};
const body = `{"activityId":"61e1325060d5e803f2e8fd43","taskBizType":"LEARNING","dailyLearningId":"61f4b202a655f932452c8449"}`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
