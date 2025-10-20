// 测试环境变量读取
console.log('测试环境变量读取...');

// 测试MH_COOKIE
if (process.env.MH_COOKIE) {
  console.log('MH_COOKIE:', process.env.MH_COOKIE);
  const cookies = process.env.MH_COOKIE.indexOf('&') > -1 ? 
    process.env.MH_COOKIE.split('&') : 
    [process.env.MH_COOKIE];
  console.log('解析出的Cookie数量:', cookies.length);
} else {
  console.log('未设置MH_COOKIE环境变量');
}

// 测试MH_PHONE_NUMBERS
if (process.env.MH_PHONE_NUMBERS) {
  console.log('MH_PHONE_NUMBERS:', process.env.MH_PHONE_NUMBERS);
  const phones = process.env.MH_PHONE_NUMBERS.indexOf('&') > -1 ? 
    process.env.MH_PHONE_NUMBERS.split('&') : 
    [process.env.MH_PHONE_NUMBERS];
  console.log('解析出的手机号数量:', phones.length);
} else {
  console.log('未设置MH_PHONE_NUMBERS环境变量');
}

// 测试其他环境变量
console.log('MH_USER_AGENT:', process.env.MH_USER_AGENT || '未设置');
console.log('LOTTERY_ADDRESS_IDS:', process.env.LOTTERY_ADDRESS_IDS || '未设置');
console.log('MH_SMS_CODE:', process.env.MH_SMS_CODE || '未设置(默认123456)');
console.log('MH_DEBUG:', process.env.MH_DEBUG || '未设置(默认false)');