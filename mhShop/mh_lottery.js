/*
美好平台抽奖脚本
cron "0 9,15,21 * * *" mh_lottery.js, tag=美好平台抽奖
*/

// 模拟process对象，使其在浏览器中可用
if (typeof process === 'undefined') {
  window.process = {
    env: {}
  };
}

// 模拟module.exports，使其在浏览器中可用
if (typeof module === 'undefined') {
  window.module = {
    exports: {}
  };
}

const $ = new Env('美好平台抽奖');
const notify = $.isNode() ? require('../sendNotify') : '';
$.get = $.get || function() {};
$.post = $.post || function() {};
$.wait = $.wait || function() {};
$.done = $.done || function() {};

// 导入Cookie管理
let cookiesArr = [], cookie = '', message = '';
let phoneNumbersArr = []; // 手机号数组

if ($.isNode()) {
  // 导入Cookie
  Object.keys(require('./mhCookie.js')).forEach((item) => {
    if (require('./mhCookie.js')[item] && item.startsWith('CookieMH')) {
      cookiesArr.push(require('./mhCookie.js')[item])
    }
  })
  
  // 导入手机号
  Object.keys(require('./mhCookie.js')).forEach((item) => {
    if (require('./mhCookie.js')[item] && item.startsWith('PhoneNumber')) {
      phoneNumbersArr.push(require('./mhCookie.js')[item])
    }
  })
  
  // 处理环境变量中的Cookie
  if (process.env.MH_COOKIE && process.env.MH_COOKIE.indexOf('&') > -1) {
    cookiesArr = process.env.MH_COOKIE.split('&');
  } else if (process.env.MH_COOKIE && process.env.MH_COOKIE.indexOf('\n') > -1) {
    cookiesArr = process.env.MH_COOKIE.split('\n');
  } else if (process.env.MH_COOKIE) {
    cookiesArr = [process.env.MH_COOKIE];
  }
  
  // 处理环境变量中的手机号
  if (process.env.MH_PHONE_NUMBERS && process.env.MH_PHONE_NUMBERS.indexOf('&') > -1) {
    phoneNumbersArr = process.env.MH_PHONE_NUMBERS.split('&');
  } else if (process.env.MH_PHONE_NUMBERS && process.env.MH_PHONE_NUMBERS.indexOf('\n') > -1) {
    phoneNumbersArr = process.env.MH_PHONE_NUMBERS.split('\n');
  } else if (process.env.MH_PHONE_NUMBERS) {
    phoneNumbersArr = [process.env.MH_PHONE_NUMBERS];
  }
}

// 美好平台API基础配置
const API_BASE_URL = 'https://meihao.v3.api.meihaocvs.com';
const USER_AGENT = $.isNode() ? (process.env.MH_USER_AGENT ? process.env.MH_USER_AGENT : (require('./MH_USER_AGENTS').MH_USER_AGENT)) : "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1";

// 抽奖地址ID列表（根据配置的地址id列表来判断调用几次）
const LOTTERY_ADDRESS_IDS = process.env.LOTTERY_ADDRESS_IDS ? process.env.LOTTERY_ADDRESS_IDS.split('&') : [];

!(async () => {
  // 检查环境变量并给出更详细的提示
  if (!cookiesArr[0] && !phoneNumbersArr[0]) {
    $.msg($.name, '【提示】请先设置Cookie或手机号', 
      '请在环境变量中设置MH_COOKIE或MH_PHONE_NUMBERS\n' +
      '1. MH_COOKIE: 美好平台Cookie，多个账号用&分隔\n' +
      '2. MH_PHONE_NUMBERS: 手机号列表，多个手机号用&分隔\n' +
      '3. 参考文档: https://bean.m.jd.com/bean/signIndex.action', 
      {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  
  console.log(`\n==================== 共${Math.max(cookiesArr.length, phoneNumbersArr.length)}个账号 ====================\n`);
  
  const accountCount = Math.max(cookiesArr.length, phoneNumbersArr.length);
  for (let i = 0; i < accountCount; i++) {
    cookie = cookiesArr[i] || '';
    const phoneNumber = phoneNumbersArr[i] || '';
    
    $.UserName = cookie ? decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]) : `手机号用户${i+1}`;
    $.index = i + 1;
    $.isLogin = true;
    $.nickName = '';
    message = '';
    
    console.log(`\n******开始【美好平台账号${$.index}】${$.nickName || $.UserName}*********\n`);
    
    // 如果提供了手机号，则执行登录流程
    if (phoneNumber) {
      await loginWithPhone(phoneNumber);
    }
    
    // 检查登录状态
    if (!$.isLogin) {
      $.msg($.name, `【提示】账号${$.index}已失效`, `美好平台账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://meihao.v3.api.meihaocvs.com`, {"open-url": "https://meihao.v3.api.meihaocvs.com"});
      if ($.isNode()) {
        await notify.sendNotify(`${$.name}账号已失效 - ${$.UserName}`, `美好平台账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
      }
      continue;
    }
    
    // 获取用户信息
    await getUserInfo();
    
    // 获取抽奖次数
    await getLotteryCount();
    
    // 更新抽奖地址
    await updateLotteryAddress();
    
    // 获取抽奖券数量
    await listUserLotteryCoupon();
    
    // 获取用户抽奖次数
    await getUserLotteryCouponCount();
    
    // 执行抽奖
    await performLottery();
    
    // 账号间延迟
    if (i < accountCount - 1) {
      console.log(`⏳ 账号间延迟5秒...`);
      await $.wait(5000);
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

// 通过手机号登录
async function loginWithPhone(phoneNumber) {
  console.log(`🔐 开始手机号登录流程: ${phoneNumber}`);
  
  // 1. 获取验证码
  const smsResult = await getSmsCode(phoneNumber);
  if (!smsResult.success) {
    console.log(`❌ 获取验证码失败: ${smsResult.message}`);
    $.isLogin = false;
    return;
  }
  
  // 这里需要手动输入验证码或从其他途径获取
  // 在实际脚本运行中，我们假设验证码是123456或者从环境变量获取
  let smsCode = process.env.MH_SMS_CODE || '123456';
  console.log(`💡 验证码获取成功，假设验证码为: ${smsCode}`);
  
  // 如果是测试环境且没有设置验证码，则提示用户需要手动设置
  if ((!process.env.MH_SMS_CODE || process.env.MH_SMS_CODE === '') && 
      (!process.env.MH_DEBUG || process.env.MH_DEBUG !== 'true')) {
    console.log(`⚠️  请注意：实际运行时需要设置MH_SMS_CODE环境变量或在代码中指定验证码`);
  }
  
  // 2. 登录
  const loginResult = await appLogin(phoneNumber, smsCode);
  if (!loginResult.success) {
    console.log(`❌ 登录失败: ${loginResult.message}`);
    $.isLogin = false;
    return;
  }
  
  // 保存登录信息到cookie
  cookie = loginResult.cookie || cookie;
  console.log(`✅ 手机号登录成功`);
  
  // 可选：保存用户信息
  if (loginResult.data) {
    console.log(`👤 用户ID: ${loginResult.data.user_id || '未知'}`);
    console.log(`📱 手机号: ${loginResult.data.phone || phoneNumber}`);
  }
}

// 获取短信验证码
function getSmsCode(phone) {
  return new Promise(resolve => {
    const options = {
      url: `${API_BASE_URL}/api/data/getSmsCode`,
      method: 'POST',
      headers: {
        "Host": "meihao.v3.api.meihaocvs.com",
        "Accept": "application/json, text/plain, */*",
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      },
      body: JSON.stringify({
        "phone": phone
      })
    }
    
    // 如果是开发模式，添加额外参数
    if (process.env.MH_DEBUG && process.env.MH_DEBUG === 'true') {
      options.body = JSON.stringify({
        "phone": phone,
        "nonce": "abc",
        "timestamp": new Date().getTime()
      });
    }
    
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 获取短信验证码API请求失败，请检查网络重试`)
          resolve({ success: false, message: '网络请求失败' });
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.code === 0) {
              console.log(`✅ 获取短信验证码成功`);
              resolve({ success: true });
            } else {
              console.log(`❌ 获取短信验证码失败: ${data.message || '未知错误'}`);
              resolve({ success: false, message: data.message || '获取验证码失败' });
            }
          } else {
            console.log(`美好平台服务器返回空数据`)
            resolve({ success: false, message: '服务器返回空数据' });
          }
        }
      } catch (e) {
        $.logErr(e, resp)
        resolve({ success: false, message: '数据解析失败' });
      }
    })
  })
}

// 手机号登录
function appLogin(phone, smsCode) {
  return new Promise(resolve => {
    const options = {
      url: `${API_BASE_URL}/api/app/login`,
      method: 'POST',
      headers: {
        "Host": "meihao.v3.api.meihaocvs.com",
        "Accept": "application/json, text/plain, */*",
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      },
      body: JSON.stringify({
        "login_type": 3, // 手机号登录类型
        "phone": phone,
        "sms_code": smsCode,
        "promote_code": ""
      })
    }
    
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 登录API请求失败，请检查网络重试`)
          resolve({ success: false, message: '网络请求失败' });
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.code === 0) {
              // 登录成功，保存cookie信息
              const token = data.data.token || '';
              const sessionId = data.data.sessionId || '';
              const newCookie = `token=${token};sessionId=${sessionId}`;
              console.log(`✅ 登录成功`);
              resolve({ success: true, cookie: newCookie, data: data.data });
            } else {
              console.log(`❌ 登录失败: ${data.message || '未知错误'}`);
              resolve({ success: false, message: data.message || '登录失败' });
            }
          } else {
            console.log(`美好平台服务器返回空数据`)
            resolve({ success: false, message: '服务器返回空数据' });
          }
        }
      } catch (e) {
        $.logErr(e, resp)
        resolve({ success: false, message: '数据解析失败' });
      }
    })
  })
}

// 获取用户信息
function getUserInfo() {
  return new Promise(resolve => {
    // 如果没有cookie，跳过获取用户信息
    if (!cookie) {
      console.log(`⚠️ 未设置cookie，跳过获取用户信息`);
      resolve();
      return;
    }
    
    const options = {
      url: `${API_BASE_URL}/user/info`,
      headers: {
        "Host": "meihao.v3.api.meihaocvs.com",
        "Accept": "application/json, text/plain, */*",
        "Cookie": cookie,
        "User-Agent": USER_AGENT,
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 获取用户信息API请求失败，请检查网络重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.code === 0) {
              $.nickName = data.data.nickname || $.UserName;
              console.log(`✅ 用户信息获取成功: ${$.nickName}`);
              // 输出更多用户信息
              if (data.data.user_id) {
                console.log(`🆔 用户ID: ${data.data.user_id}`);
              }
              if (data.data.phone) {
                console.log(`📱 绑定手机号: ${data.data.phone}`);
              }
              if (data.data.vip_level) {
                console.log(`⭐ VIP等级: ${data.data.vip_level}`);
              }
            } else {
              console.log(`❌ 获取用户信息失败: ${data.message || '未知错误'}`);
              // 如果是token过期相关的错误，标记为未登录
              if (data.code === 1001 || data.message.includes('登录') || data.message.includes('token')) {
                $.isLogin = false;
              }
            }
          } else {
            console.log(`美好平台服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// 调用clickShare接口获取一次抽奖次数
function clickShareForLottery() {
  return new Promise(resolve => {
    // 如果没有cookie，跳过
    if (!cookie) {
      console.log(`⚠️ 未设置cookie，跳过获取分享抽奖次数`);
      resolve(false);
      return;
    }
    
    const options = {
      url: `${API_BASE_URL}/operations/clickShare`,
      method: 'POST',
      headers: {
        "Host": "meihao.v3.api.meihaocvs.com",
        "Accept": "application/json, text/plain, */*",
        "Cookie": cookie,
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      },
      body: JSON.stringify({
        "sys_component_tpl_id": "", // 根据实际需要填写
        "user_vip_id": "", // 根据实际需要填写
        "share_type": 1,
        "parent_share_user_log_id": ""
      })
    }
    
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 获取分享抽奖次数API请求失败，请检查网络重试`)
          resolve(false);
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.code === 0) {
              console.log(`✅ 通过分享获得抽奖次数成功`);
              resolve(true);
            } else {
              console.log(`❌ 通过分享获得抽奖次数失败: ${data.message || '未知错误'}`);
              // 即使失败也继续执行，因为可能已经没有分享机会了
              resolve(false);
            }
          } else {
            console.log(`美好平台服务器返回空数据`)
            resolve(false);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
        resolve(false);
      }
    })
  })
}

// 更新抽奖地址
async function updateLotteryAddress() {
  console.log(`📍 开始更新抽奖地址`);
  if (LOTTERY_ADDRESS_IDS.length === 0) {
    console.log(`⚠️ 未配置抽奖地址ID，跳过地址更新`);
    return;
  }
  
  // 如果没有cookie，跳过
  if (!cookie) {
    console.log(`⚠️ 未设置cookie，跳过抽奖地址更新`);
    return;
  }
  
  // 获取用户抽奖记录，以便获取lottery_user_log_id
  try {
    const lotteryLogs = await listLotteryUserLog();
    if (!lotteryLogs || lotteryLogs.length === 0) {
      console.log(`⚠️ 没有抽奖记录，跳过地址更新`);
      return;
    }
    
    // 遍历地址ID列表，为每个地址调用更新接口
    for (let i = 0; i < Math.min(LOTTERY_ADDRESS_IDS.length, lotteryLogs.length); i++) {
      const addressId = LOTTERY_ADDRESS_IDS[i];
      const lotteryLog = lotteryLogs[i];
      
      console.log(`📍 更新第${i+1}个抽奖地址: ${addressId}`);
      
      // 调用更新地址接口
      const result = await doUpdateLotteryAddress(
        lotteryLog.lottery_user_log_id,
        addressId,
        '', // user_address，如果需要可以添加
        '', // shop_code，如果需要可以添加
        ''  // shop_name，如果需要可以添加
      );
      
      if (result.success) {
        console.log(`✅ 第${i+1}个抽奖地址更新成功`);
      } else {
        console.log(`❌ 第${i+1}个抽奖地址更新失败: ${result.message}`);
      }
      
      // 添加延迟避免请求过于频繁
      if (i < LOTTERY_ADDRESS_IDS.length - 1) {
        await $.wait(1000);
      }
    }
    
    console.log(`✅ 抽奖地址更新完成，共处理${Math.min(LOTTERY_ADDRESS_IDS.length, lotteryLogs.length)}个地址`);
  } catch (e) {
    console.log(`❌ 更新抽奖地址时出错: ${e.message}`);
  }
}

// 获取用户抽奖记录
function listLotteryUserLog() {
  return new Promise(resolve => {
    // 如果没有cookie，跳过
    if (!cookie) {
      resolve([]);
      return;
    }
    
    const options = {
      url: `${API_BASE_URL}/lottery/listLotteryUserLog`,
      method: 'POST',
      headers: {
        "Host": "meihao.v3.api.meihaocvs.com",
        "Accept": "application/json, text/plain, */*",
        "Cookie": cookie,
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      },
      body: JSON.stringify({
        "pageIndex": 1,
        "pageSize": 10,
        "is_all": 0,
        "item_type": "", // 根据实际需要填写
        "lottery_type": 10
      })
    }
    
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 获取用户抽奖记录API请求失败，请检查网络重试`)
          resolve([]);
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.code === 0) {
              const logs = data.data?.list || [];
              console.log(`✅ 获取用户抽奖记录成功，共${logs.length}条记录`);
              resolve(logs);
            } else {
              console.log(`❌ 获取用户抽奖记录失败: ${data.message || '未知错误'}`);
              resolve([]);
            }
          } else {
            console.log(`美好平台服务器返回空数据`)
            resolve([]);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
        resolve([]);
      }
    })
  })
}

// 更新单个抽奖地址
function doUpdateLotteryAddress(lottery_user_log_id, user_addr_id, user_address, shop_code, shop_name) {
  return new Promise(resolve => {
    // 如果没有cookie，跳过
    if (!cookie) {
      resolve({ success: false, message: '未设置cookie' });
      return;
    }
    
    const options = {
      url: `${API_BASE_URL}/lottery/updateLotterItemAddress`,
      method: 'POST',
      headers: {
        "Host": "meihao.v3.api.meihaocvs.com",
        "Accept": "application/json, text/plain, */*",
        "Cookie": cookie,
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      },
      body: JSON.stringify({
        "lottery_user_log_id": lottery_user_log_id,
        "user_addr_id": user_addr_id,
        "user_address": user_address,
        "shop_code": shop_code,
        "shop_name": shop_name
      })
    }
    
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 更新抽奖地址API请求失败，请检查网络重试`)
          resolve({ success: false, message: '网络请求失败' });
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.code === 0) {
              resolve({ success: true });
            } else {
              resolve({ success: false, message: data.message || '更新地址失败' });
            }
          } else {
            console.log(`美好平台服务器返回空数据`)
            resolve({ success: false, message: '服务器返回空数据' });
          }
        }
      } catch (e) {
        $.logErr(e, resp)
        resolve({ success: false, message: '数据解析失败' });
      }
    })
  })
}

// 获取用户抽奖券列表
function listUserLotteryCoupon() {
  return new Promise(resolve => {
    // 如果没有cookie，跳过
    if (!cookie) {
      console.log(`⚠️ 未设置cookie，跳过获取用户抽奖券列表`);
      resolve();
      return;
    }
    
    const options = {
      url: `${API_BASE_URL}/lottery/listUserLotteryCoupon`,
      headers: {
        "Host": "meihao.v3.api.meihaocvs.com",
        "Accept": "application/json, text/plain, */*",
        "Cookie": cookie,
        "User-Agent": USER_AGENT,
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 获取用户抽奖券列表API请求失败，请检查网络重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.code === 0) {
              const couponCount = data.data?.list?.length || 0;
              const coupons = data.data?.list || [];
              
              console.log(`✅ 获取用户抽奖券列表成功，共有${couponCount}张抽奖券`);
              message += `【抽奖券数量】${couponCount}张\n`;
              
              // 输出每张抽奖券的详细信息
              if (coupons.length > 0) {
                console.log(`🎟️ 抽奖券详情:`);
                coupons.forEach((coupon, index) => {
                  const name = coupon.coupon_name || '未知';
                  const type = coupon.coupon_type || '未知';
                  const status = coupon.user_coupon_status == 2 ? '未使用' : '已使用';
                  console.log(`   ${index+1}. ${name} (${type}) - ${status}`);
                });
              }
            } else {
              console.log(`❌ 获取用户抽奖券列表失败: ${data.message || '未知错误'}`);
            }
          } else {
            console.log(`美好平台服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// 获取用户抽奖次数
function getUserLotteryCouponCount() {
  return new Promise(resolve => {
    // 如果没有cookie，跳过
    if (!cookie) {
      console.log(`⚠️ 未设置cookie，跳过获取用户抽奖次数`);
      resolve();
      return;
    }
    
    const options = {
      url: `${API_BASE_URL}/lottery/getUserLotteryCouponCount`,
      headers: {
        "Host": "meihao.v3.api.meihaocvs.com",
        "Accept": "application/json, text/plain, */*",
        "Cookie": cookie,
        "User-Agent": USER_AGENT,
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 获取用户抽奖次数API请求失败，请检查网络重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.code === 0) {
              $.lotteryCount = data.data.count || 0;
              console.log(`✅ 获取用户抽奖次数成功，可抽奖次数: ${$.lotteryCount}`);
              message += `【可抽奖次数】${$.lotteryCount}次\n`;
              
              // 如果有额外信息，也输出
              if (data.data.description) {
                console.log(`ℹ️ ${data.data.description}`);
              }
            } else {
              console.log(`❌ 获取用户抽奖次数失败: ${data.message || '未知错误'}`);
              $.lotteryCount = 0;
              
              // 特殊处理：如果是因为没有抽奖资格导致的错误
              if (data.message && (data.message.includes('没有') || data.message.includes('不足'))) {
                console.log(`ℹ️ 提示：可能需要先完成一些任务来获取抽奖资格`);
              }
            }
          } else {
            console.log(`美好平台服务器返回空数据`)
            $.lotteryCount = 0;
          }
        }
      } catch (e) {
        $.logErr(e, resp)
        $.lotteryCount = 0;
      } finally {
        resolve();
      }
    })
  })
}

// 执行抽奖
async function performLottery() {
  if (!cookie) {
    console.log(`⚠️ 未设置cookie，跳过抽奖`);
    message += `【抽奖结果】未设置cookie，跳过抽奖\n`;
    return;
  }
  
  if (!$.lotteryCount || $.lotteryCount <= 0) {
    console.log(`❌ 没有抽奖资格，跳过抽奖`);
    message += `【抽奖结果】没有抽奖资格\n`;
    return;
  }
  
  console.log(`🎯 开始执行抽奖，共${$.lotteryCount}次机会`);
  let successCount = 0;
  let rewards = [];
  
  for (let i = 0; i < $.lotteryCount; i++) {
    console.log(`\n🎲 第${i + 1}次抽奖...`);
    const result = await doLottery();
    
    if (result.success) {
      successCount++;
      rewards.push(result.reward);
      console.log(`✅ 第${i + 1}次抽奖成功: ${result.reward}`);
      
      // 如果有奖励类型信息，也显示
      if (result.type) {
        console.log(`ℹ️ 奖励类型: ${result.type}`);
      }
    } else {
      console.log(`❌ 第${i + 1}次抽奖失败: ${result.message}`);
      
      // 特殊处理：如果是因为没有抽奖次数导致的失败，提前结束循环
      if (result.message && (result.message.includes('次数') || result.message.includes('不足'))) {
        console.log(`ℹ️ 检测到抽奖次数不足，提前结束抽奖`);
        break;
      }
    }
    
    // 抽奖间隔，避免请求过于频繁
    if (i < $.lotteryCount - 1) {
      await $.wait(2000);
    }
  }
  
  console.log(`\n🎊 抽奖完成！成功${successCount}次，失败${$.lotteryCount - successCount}次`);
  message += `【抽奖结果】成功${successCount}次，失败${$.lotteryCount - successCount}次\n`;
  
  if (rewards.length > 0) {
    console.log(`🎁 获得奖励: ${rewards.join(', ')}`);
    message += `【获得奖励】${rewards.join(', ')}\n`;
  }
  
  // 发送通知
  if ($.isNode() && notify) {
    await notify.sendNotify(`${$.name} - ${$.nickName || $.UserName}`, message);
  }
}

// 单次抽奖
function doLottery() {
  return new Promise(resolve => {
    // 如果没有cookie，跳过
    if (!cookie) {
      resolve({ success: false, message: '未设置cookie' });
      return;
    }
    
    const options = {
      url: `${API_BASE_URL}/lottery/winner`,
      method: 'POST',
      headers: {
        "Host": "meihao.v3.api.meihaocvs.com",
        "Accept": "application/json, text/plain, */*",
        "Cookie": cookie,
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      },
      body: JSON.stringify({
        "condition": "", // 根据实际需要填写
        "lottery_type": 10
      })
    }
    
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 抽奖API请求失败，请检查网络重试`)
          resolve({ success: false, message: '网络请求失败' });
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.code === 0) {
              // 抽奖成功
              const prizeInfo = data.data;
              const reward = prizeInfo.prize_name || prizeInfo.reward || '未知奖励';
              const prizeType = prizeInfo.prize_type || '未知类型';
              
              resolve({ 
                success: true, 
                reward: reward,
                type: prizeType,
                data: prizeInfo
              });
            } else {
              // 抽奖失败
              resolve({ success: false, message: data.message || '抽奖失败' });
            }
          } else {
            console.log(`美好平台服务器返回空数据`)
            resolve({ success: false, message: '服务器返回空数据' });
          }
        }
      } catch (e) {
        $.logErr(e, resp)
        resolve({ success: false, message: '数据解析失败' });
      }
    })
  })
}

// 获取抽奖次数（整合函数）
async function getLotteryCount() {
  console.log(`📊 开始获取抽奖次数`);
  
  // 调用clickShare接口获取一次抽奖次数
  const shareResult = await clickShareForLottery();
  if (shareResult) {
    console.log(`👍 通过分享成功获取抽奖次数`);
  } else {
    console.log(`ℹ️ 通过分享获取抽奖次数失败或无机会`);
  }
  
  console.log(`✅ 抽奖次数获取完成`);
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar(t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}