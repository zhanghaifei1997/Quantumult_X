
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */
$notify('执行红旗微店签到脚本')

const url = `https://miniapp-hqwd.faw.cn/Interaction/api/v1/Sign/SignInformation`;
const method = `POST`;
const headers = {
'Accept-Encoding' : `gzip,compress,br,deflate`,
'content-type' : `application/json`,
'Connection' : `keep-alive`,
'Referer' : `https://servicewechat.com/wx30f3bf3802047cf6/104/page-frame.html`,
'Host' : `miniapp-hqwd.faw.cn`,
'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.16(0x18001038) NetType/WIFI Language/zh_CN`,
'Authorization' : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im83Z2dKNDBaMkFyTXhSQVlST3pLaVlhdlhobFkiLCJuYmYiOjE2Mzk2MDgwNDMsImV4cCI6MTYzOTY5NDQ0MywiaXNzIjoibWluaWFwcC1ocXdkIiwiYXVkIjoibWluaWFwcC1ocXdkIn0.eDwtYkcEHDntBg9DnU58Rwg1osELd5GnnvNfTVyzlx4`
};
const body = `{"sessionId":"6554d2cd874d442b823f91ca59697038","appid":"wx30f3bf3802047cf6","userid":"b2c39600-6a7b-490d-8059-81ac6356ab9f","signdate":"2021-12-16"}`;

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
