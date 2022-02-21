
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `https://hqapp.faw.cn/fawcshop/collect-public/v1/score/addScore`;
const method = `POST`;
const headers = {
'aid' : `1426952704488189954`,
'Connection' : `keep-alive`,
'Accept-Encoding' : `gzip, deflate, br`,
'version' : `3.13.0`,
'Content-Type' : `application/json`,
'User-Agent' : `HQZL_Ultimate_iOS/3.13.0 (iPhone; iOS 15.1; Scale/2.00)`,
'platform' : `2`,
'Authorization' : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzIjoyNTkyMDAwLCJ1c2VyX2lkIjo1ODY5MzE2MDI4NDAzNTQ4MTYsImlzcyI6IlJCQUMtQVBJIiwidG9rZW5Gcm9tIjoiQVBQIiwiZXhwIjoxNjQ0MTkxNDM1LCJpYXQiOjE2NDE1OTk0MzUsInNpZ25fdGltZSI6MTY0MTU5OTQzNTc2OX0.Glwhp9ZYaGu9iAv5KgttV3p-JqLHGtunZjJbKYVkr5c`,
'Cookie' : `JSESSIONID=dROCaJza6tcNU-ecosiqs5Eb8eyl__t0uXptBtLn; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221426952704488189954%22%2C%22first_id%22%3A%2217e5783838a1360-05abee4d1db5698-744c1651-370944-17e5783838b1946%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfbG9naW5faWQiOiIxNDI2OTUyNzA0NDg4MTg5OTU0IiwiJGlkZW50aXR5X2Nvb2tpZV9pZCI6IjE3ZTU3ODM4MzhhMTM2MC0wNWFiZWU0ZDFkYjU2OTgtNzQ0YzE2NTEtMzcwOTQ0LTE3ZTU3ODM4MzhiMTk0NiJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%221426952704488189954%22%7D%2C%22%24device_id%22%3A%2217e5783838a1360-05abee4d1db5698-744c1651-370944-17e5783838b1946%22%7D`,
'Host' : `hqapp.faw.cn`,
'Accept-Language' : `zh-Hans-CN;q=1, en-CN;q=0.9`,
'Accept' : `*/*`
};
const body = `{"scoreType":2}`;

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
