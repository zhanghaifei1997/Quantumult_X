# 红旗智联

> 2021-10-27 创建脚本




## 配置 (QuanX)

```properties
[MITM]
hqapp.faw.cn

[rewrite_local]
# 190及以后版本
^https:\/\/hqapp.faw.cn\/fawcshop\/mall\/v1\/apiCus\/getUserInfo url script-request-body https://raw.githubusercontent.com/zhanghaifei1997/Quantumult_X/main/hqzl/GetCookie.js

[task_local]
1 0 * * * hqzl.js
```

## 说明

> 先在登录成功后, 再打开获取 Cookie 的脚本

1. 先配置`[MITM]`

   - QuanX: hqapp.faw.cn
2. 再配置重写规则:
 
   - QuanX: 把`GetCookie.js`和`hqzl.js`传到`On My iPhone - Quantumult X - Scripts` (传到 iCloud 相同目录也可, 注意要打开 quanx 的 iCloud 开关)
3. 打开 APP 手动签到一次: 访问下右下角 `我` > `签到` (头像下面)
4. 系统提示: `获取Cookie: 成功`
5. 最后就可以把第 1 条脚本注释掉了

> 第 1 条脚本是用来获取 cookie 的, 用浏览器访问一次获取 cookie 成功后就可以删掉或注释掉了, 但请确保在`登录成功`后再获取 cookie.

> 第 2 条脚本是签到脚本, 每天`00:00:10`执行一次.

## 常见问题

1. 无法写入 Cookie

   - 检查 Surge 系统通知权限放开了没
   - 如果你用的是 Safari, 请尝试在浏览地址栏`手动输入网址`(不要用复制粘贴)

2. 写入 Cookie 成功, 但签到不成功

   - 看看是不是在登录前就写入 Cookie 了
   - 如果是，请确保在登录成功后，再尝试写入 Cookie

3. 为什么有时成功有时失败

   - 很正常，网络问题，哪怕你是手工签到也可能失败（凌晨签到容易拥堵就容易失败）
   - 暂时不考虑代码级的重试机制，但咱有配置级的（暴力美学）：

  

   - `QuanX`配置:

     ```properties
     [task_local]
		# 没有什么是一顿饭解决不了的:
	 1 0 * * * xxx.js # 每天00:01执行一次
     2 0 * * * xxx.js # 每天00:02执行一次
     3 0 * * * xxx.js # 每天00:03执行一次

     */60 * * * * xxx.js # 每60分执行一次
     ```

## 感谢




