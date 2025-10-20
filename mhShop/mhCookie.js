/*
此文件为Node.js专用。其他用户请忽略
美好平台Cookie管理脚本
 */
//此处填写美好平台账号cookie。
let CookieMHs = [
  '',//账号一ck,例:token=XXX;sessionId=XXX;
  '',//账号二ck,例:token=XXX;sessionId=XXX;如有更多,依次类推
]

// 判断环境变量里面是否有美好平台ck
if (process.env.MH_COOKIE) {
  if (process.env.MH_COOKIE.indexOf('&') > -1) {
    console.log(`您的美好平台cookie选择的是用&隔开\n`)
    CookieMHs = process.env.MH_COOKIE.split('&');
  } else if (process.env.MH_COOKIE.indexOf('\n') > -1) {
    console.log(`您的美好平台cookie选择的是用换行隔开\n`)
    CookieMHs = process.env.MH_COOKIE.split('\n');
  } else {
    CookieMHs = [process.env.MH_COOKIE];
  }
}

// 去重和过滤空值
CookieMHs = [...new Set(CookieMHs.filter(item => !!item))]
console.log(`\n====================共有${CookieMHs.length}个美好平台账号Cookie=========\n`);

// 导出Cookie
for (let i = 0; i < CookieMHs.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['CookieMH' + index] = CookieMHs[i].trim();
}

// 导出手机号列表
let PhoneNumbers = [];
if (process.env.MH_PHONE_NUMBERS) {
  if (process.env.MH_PHONE_NUMBERS.indexOf('&') > -1) {
    console.log(`您的美好平台手机号选择的是用&隔开\n`)
    PhoneNumbers = process.env.MH_PHONE_NUMBERS.split('&');
  } else if (process.env.MH_PHONE_NUMBERS.indexOf('\n') > -1) {
    console.log(`您的美好平台手机号选择的是用换行隔开\n`)
    PhoneNumbers = process.env.MH_PHONE_NUMBERS.split('\n');
  } else {
    PhoneNumbers = [process.env.MH_PHONE_NUMBERS];
  }
}

// 去重和过滤空值
PhoneNumbers = [...new Set(PhoneNumbers.filter(item => !!item))]

console.log(`====================共有${PhoneNumbers.length}个美好平台手机号=========\n`);

// 导出手机号
for (let i = 0; i < PhoneNumbers.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['PhoneNumber' + index] = PhoneNumbers[i].trim();
}

// 添加时间戳输出
console.log(`==================脚本执行- 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()}=====================\n`)

// 调试模式控制
if (process.env.MH_DEBUG && process.env.MH_DEBUG === 'false') {
  console.log = () => {};
  console.log(`已开启调试模式静默`);
}