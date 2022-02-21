
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */
$notify('执行红旗空间签到脚本')

const url = `https://hqpp-gw.faw.cn/gimc-hongqi-webapp/f/checkin/user-checkin/?_timestamp=${Date.now()}`;
const method = `GET`;
const headers = {
'cookie' : `JSESSIONID=68fcfae6-7c6b-40a4-846a-47c759c58a44, Path=/gimc-hongqi-webapp, HttpOnly;rememberMe=deleteMe, Path=/gimc-hongqi-webapp, Max-Age=0, Expires=Wed, 15-Dec-2021 16:31:30 GMT`,
'content-type' : `application/json`,
'Connection' : `keep-alive`,
'Accept-Encoding' : `gzip,compress,br,deflate`,
'Referer' : `https://servicewechat.com/wxf076d8670405c937/70/page-frame.html`,
'Host' : `hqpp-gw.faw.cn`,
'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.16(0x18001039) NetType/WIFI Language/zh_CN`
};
const body = ``;

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
