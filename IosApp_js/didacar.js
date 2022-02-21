
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

$notify('执行滴答签到脚本')
sign2()
sign1()
function sign2(){ 


const url = `https://capis-3.didapinche.com/active/beike/sign`;
const method = `POST`;
const headers = {
'Accept-Encoding' : `gzip, deflate, br`,
'Accept' : `*/*`,
'Connection' : `keep-alive`,
'Content-Type' : `application/x-www-form-urlencoded`,
'ddcinfo' : `xMBPaen8FeTm6vYl5KB4SkwR6MopzTW6B4xftQZiR00hZ7pBeP3pFtJnUFr2+Yt546TiWLrDjuUFEpcT/5v5cvoxitP+lkdicybfkNN45z4tgqKWEbjWeiD3dnYLstjQA6rWrZWVkvfnrT7wZ1SnKamR4qwuZ015C6a9zOkuqywtlEfzLrnZtq+Vj3GFkpsatD7SAYkoc9ZPwen2fFouVcn8AT+jBwoQMwZLLf0hnWCjNO+ncXDCInPa00/7Y31tMeE6eqTc7gZU35yfkAAvPPyivpD5Dt9uZ7THCCyMQwJkTMB66ld9Nlq8LVrW0ZFfY3AmGxalQ9mSzy1LSkYn+4PobRSNduQTy5l8t1CyO2XUDN8uC6sS6RZIJeEUfiX6LaOAPhVo5om1HFO2KrcSZ0huczllmxMqfhsh/j8GbzscJIfjXGV+yO4GFE/T3KuhFdVdS6K9URXJGBRxwZxT+sDC4kdPjNf446o7sGGCIpbTDItODejdmsi9d6WD1hpm+NVr/4zNThH9jKO6dPQJnrNG2e8qmFGNmio0wZbvZN8+bo6P+0JLy7wqsGpyN+6+C/JL7FNc/Fj0gXNv9USJi16jnem7XCIj7eQBnt1P1rBXZCbpjZCA9pu5dDj1mb1695axtJ/KE2i3yY08FVGLgo87u/bA/um6H3dA1l9wWlW9O6Wc4d3vZYjHpuAKGtwP7oyMNrHKBiVIdvBFDA8KhFzzoW4oYjq8wNeZlkJ66OGmp0AW33wFiUXx67NqEQDOVtyc5ARRwSfLSYN5dqI7RW8kXE3VIhN3ASM/o4nxNPEEHrPZmEXvkAX57elqtox80rGv3g5D1usE+9rxT/fmLDni1QNrz2xnwbd84ZE+f4RMoBIe2l3Jt6FGkdsx0otSst/tWjLLZ2YnVIYMs4KjepxTsng0YU712fs0aYNzZF0wVjFdjg4fDb6mGCurO4+OpZv7W1r8OF2EG04I0TlIDW/U9Cb2s8oi6zxPWFDg2lGYGw9L/AQOuDUIN6Ao9qJ9`,
'Host' : `capis-3.didapinche.com`,
'User-Agent' : `DidaPinche/8.21.0 dc(eyJsYXQiOjMyLjAwMjc2MCwibG9uIjoxMTguNzM5MzMwfQ==) (iOS 15.1;iPhone12,1) [[App]] Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
'Accept-Language' : `zh-Hans-CN;q=1, en-CN;q=0.9`,
'Authorization' : `Bearer fJjImnYK7Z+qFHpgG+oM3APWmTGab5zfSpQ6m8OLc2clNJ4rwenOPoyga8/A1WJHm03W8M3rxZrUSq/JrMpORVYL423cUnHCsIF5KSqr6ErRnuBjViaiGTmpMgb/Xo+8`,
'Sign' : `0d0c18b8e5e8008c3f8d6d6851e814e7 1642677521 carpool`
};
const body = `user_cid=f04c6479-8c87-461e-9476-8609a49d9d9e`;

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
}
function sign1(){ 

const url = `https://capis-1.didapinche.com/active/beike/sign`;
const method = `POST`;
const headers = {
'Accept-Encoding' : `gzip, deflate, br`,
'Accept' : `*/*`,
'Connection' : `keep-alive`,
'Content-Type' : `application/x-www-form-urlencoded`,
'ddcinfo' : `xMBPaen8FeTm6vYl5KB4SkwR6MopzTW6B4xftQZiR00hZ7pBeP3pFtJnUFr2+Yt546TiWLrDjuUFEpcT/5v5cvoxitP+lkdiH4OFxnVCnKzS/6ITtib9C9qAehvzs015KdqCcxmFCSK9JoHXxh7Jmhf1+tIW77bjIB021FujhtzINF7LVqWOz55IYwFOwWXc3bgLOODOr/xrj0wi5br1jxlU/iqr/w0rjt4dfkx7BO4RdSzewvceO4lPt5CxGFo4YHbHS5TO+8r0Bw4c7l3bKE5BuVv4FAcr2/4KWq/m2X5r20L6QN9g9qYqF6zIKmS2G2EnCSdkmfxtkAeY6VZ10z5R5/3hNV7gLz93QNEurawTvfQ2w+eeePX5L/1FDkXkJd7hp6vJFdjLFyWkxMKIItgdR5Nwi5XmBhx1NK7KNLNYLYOZ8KjkkJaHOz0ar3SXee8o2qTxz436Hj6YTRhwi7mm38mqnB43rpwN/1weINY9B/8f2CbmAPXMpaGuwgB+KLsj9d9sTW5ssy6BuQhNW6fsp8GBhjcpQIDT/YYXG011bEeZFVPPyqcar3sXRKjfYE6VguGStMNBP1Eu95IDUQwBnY/i+EH0R6KztlAUZ68JuYr2feXjGqlrg9+jKZdRaLXJ1ZBDT3Gf5sEcj1PhaIlTxlrPM0nXZepR7a8BoXfdGQmOpXL0lsDetxVmS2fqllrMZAV3wd9jiG7NVNoynxyxwSvtYNhgc+sIe9+rGUTkvsSuOLJMXVGjkX4E+z1bY/+wqhlhVyrPS8fh3XprdZJfPzKpwZMXwbAuphqvgeTyVmSeJBk09/YaRaWLU3Hungxk9XEW/pTFOtpI3EH8bvCyjSrwQbMwgiT6qPxSXmmfrGgGkgiRDJgaBnAFg6m3FZKK7v/f98JhhrJ/FkyBjXpJbo2Fxt8o9QzXwWCcgrRA/gzWPPWkwgvwfexmpomtRib5EcKwXlQjgpjrdg/4dVNN1E4mUgk2LsZl4Bt49o4slhVGdx5zhlPoGBMexpas`,
'Host' : `capis-1.didapinche.com`,
'User-Agent' : `DidaPinche/8.21.0 dc(eyJsYXQiOjMyLjAwMjcwMCwibG9uIjoxMTguNzM5NDEwfQ==) (iOS 15.1;iPhone12,1) [[App]] Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
'Accept-Language' : `zh-Hans-CN;q=1, en-CN;q=0.9`,
'Authorization' : `Bearer fJjImnYK7Z+qFHpgG+oM3APWmTGab5zfSpQ6m8OLc2clNJ4rwenOPoyga8/A1WJHm03W8M3rxZrUSq/JrMpORVYL423cUnHCsIF5KSqr6ErRnuBjViaiGTmpMgb/Xo+8`,
'Sign' : `a07f69d8cc603a85f801c86736ce746d 1642678067 carpool`
};
const body = `user_cid=f04c6479-8c87-461e-9476-8609a49d9d9e`;

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
}
