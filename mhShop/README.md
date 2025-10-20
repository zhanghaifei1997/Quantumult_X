# 美好平台抽奖脚本

## 功能说明

此脚本用于自动化美好平台的抽奖活动，支持以下功能：

1. 通过手机号获取验证码并登录
2. 获取用户信息
3. 通过分享获取抽奖次数
4. 更新抽奖地址
5. 获取抽奖券数量
6. 获取用户抽奖次数
7. 自动执行抽奖

## 环境变量配置

### 必须配置的环境变量

1. `MH_COOKIE` - 美好平台Cookie，多个账号用 `&` 或换行分隔
2. `MH_PHONE_NUMBERS` - 手机号列表，用于登录，多个手机号用 `&` 分隔

### 可选环境变量

1. `MH_USER_AGENT` - 自定义User-Agent
2. `LOTTERY_ADDRESS_IDS` - 抽奖地址ID列表，多个ID用 `&` 分隔
3. `MH_SMS_CODE` - 验证码（测试用，默认为123456）
4. `MH_DEBUG` - 调试模式（true/false）

## 使用方法

### 方法一：使用Cookie（推荐）

1. 配置 `MH_COOKIE` 环境变量
2. 运行脚本：`node mh_lottery.js`

### 方法二：使用手机号登录

1. 配置 `MH_PHONE_NUMBERS` 环境变量
2. （可选）配置 `MH_SMS_CODE` 环境变量
3. 运行脚本：`node mh_lottery.js`

## 注意事项

1. 脚本会自动处理网络异常重试
2. 抽奖之间有2秒间隔，避免请求过于频繁
3. 脚本会自动发送运行结果通知
4. 验证码默认为123456，实际使用时需要根据情况修改
5. 支持多账号运行，Cookie和手机号可以混合使用

## 接口说明

脚本调用的美好平台API接口：

1. `POST /api/data/getSmsCode` - 获取短信验证码
2. `POST /api/app/login` - 手机号登录
3. `GET /user/info` - 获取用户信息
4. `POST /operations/clickShare` - 通过分享获取抽奖次数
5. `GET /lottery/listUserLotteryCoupon` - 获取用户抽奖券列表
6. `GET /lottery/getUserLotteryCouponCount` - 获取用户抽奖次数
7. `POST /lottery/winner` - 执行抽奖
8. `POST /lottery/listLotteryUserLog` - 获取用户抽奖记录
9. `POST /lottery/updateLotterItemAddress` - 更新抽奖地址

## 更新日志

### v1.1
- 增强错误处理和日志输出
- 完善抽奖地址更新功能
- 优化多账号支持
- 添加更详细的用户信息展示

### v1.0
- 实现基本的抽奖功能
- 支持Cookie和手机号两种登录方式
- 支持多账号运行

## 功能说明

本脚本用于美好平台（https://meihao.v3.api.meihaocvs.com）的自动抽奖功能，包含以下特性：

- 🍪 **Cookie管理**: 支持多账号，参考JD项目的cookie管理方式
- 🎯 **抽奖资格获取**: 自动获取当前账号的抽奖次数
- 🎲 **自动抽奖**: 根据获取到的抽奖次数循环执行抽奖
- 📱 **通知推送**: 支持本地通知打印和外部通知推送
- 🔄 **多环境支持**: 兼容Node.js、QuantumultX、Surge、Loon等环境

## 文件结构

```
mhShop/
├── mhCookie.js          # Cookie管理脚本
├── MH_USER_AGENTS.js    # User-Agent管理
├── mh_lottery.js        # 主抽奖脚本
└── README.md           # 说明文档
```

## 配置方法

### 1. Cookie配置

#### 方法一：直接在文件中配置
编辑 `mhCookie.js` 文件，在 `CookieMHs` 数组中添加你的cookie：

```javascript
let CookieMHs = [
  'token=your_token_here;sessionId=your_session_id;',  // 账号一
  'token=your_token_here;sessionId=your_session_id;',  // 账号二
]
```

#### 方法二：环境变量配置
设置环境变量 `MH_COOKIE`，支持多种分隔符：

```bash
# 使用&分隔多个账号
export MH_COOKIE="token=xxx;sessionId=xxx&token=yyy;sessionId=yyy"

# 使用换行分隔多个账号
export MH_COOKIE="token=xxx;sessionId=xxx
token=yyy;sessionId=yyy"
```

### 2. 手机号登录配置

设置环境变量 `MH_PHONE_NUMBERS` 来使用手机号登录：

```bash
# 使用&分隔多个手机号
export MH_PHONE_NUMBERS="13800138000&13800138001&13800138002"

# 使用换行分隔多个手机号
export MH_PHONE_NUMBERS="13800138000
13800138001
13800138002"
```

### 3. User-Agent配置（可选）

设置环境变量 `MH_USER_AGENT` 来自定义User-Agent：

```bash
export MH_USER_AGENT="Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15"
```

### 4. 抽奖地址配置（可选）

设置环境变量 `LOTTERY_ADDRESS_IDS` 来配置抽奖地址：

```bash
export LOTTERY_ADDRESS_IDS="address_id_1&address_id_2&address_id_3"
```

### 5. 调试模式配置（可选）

设置环境变量 `MH_DEBUG` 来控制日志输出：

```bash
export MH_DEBUG="false"  # 关闭详细日志输出
```

## 使用方法

### Node.js环境

```bash
# 进入mhShop目录
cd mhShop

# 运行抽奖脚本
node mh_lottery.js
```

### 定时任务

可以配置cron定时任务自动执行：

```bash
# 每天9点、15点、21点执行
0 9,15,21 * * * cd /path/to/mhShop && node mh_lottery.js
```

### QuantumultX/Surge/Loon

将脚本添加到对应工具的脚本配置中：

```
cron "0 9,15,21 * * *" mh_lottery.js, tag=美好平台抽奖
```

## 脚本执行流程

1. **初始化**: 读取Cookie配置，检查账号有效性
2. **获取用户信息**: 验证Cookie是否有效，获取用户昵称
3. **获取抽奖资格**: 调用API获取当前可抽奖次数
4. **执行抽奖**: 根据抽奖次数循环调用抽奖接口
5. **结果通知**: 输出抽奖结果并发送通知

## 通知功能

脚本支持多种通知方式：

- **控制台输出**: 所有执行过程都会在控制台打印
- **本地通知**: 使用系统通知显示结果
- **外部通知**: 支持通过sendNotify模块发送到各种通知平台

## 注意事项

1. **Cookie获取**: 需要手动从浏览器开发者工具中获取美好平台的Cookie
2. **请求频率**: 脚本在抽奖间隔中添加了2秒延迟，避免请求过于频繁
3. **错误处理**: 脚本包含完善的错误处理机制，遇到问题会输出详细错误信息
4. **多账号支持**: 支持同时管理多个美好平台账号
5. **环境兼容**: 兼容多种JavaScript运行环境

## 获取Cookie方法

1. 打开浏览器，访问美好平台网站
2. 登录你的账号
3. 按F12打开开发者工具
4. 切换到Network（网络）标签
5. 刷新页面或进行任意操作
6. 找到请求头中的Cookie字段
7. 复制完整的Cookie值到配置文件中

## 常见问题

**Q: Cookie失效怎么办？**
A: 重新登录美好平台，按照上述方法重新获取Cookie。

**Q: 没有抽奖资格怎么办？**
A: 检查账号是否满足抽奖条件，或者等待系统刷新抽奖资格。

**Q: 脚本报错怎么办？**
A: 检查Cookie是否正确，网络是否正常，或查看错误日志定位问题。

**Q: 如何获取验证码？**
A: 脚本会自动获取验证码，但需要手动填写或通过环境变量设置。实际使用时可能需要接入短信接收平台。

## 免责声明

本脚本仅供学习和研究使用，请遵守相关网站的使用条款。使用本脚本所产生的任何后果由使用者自行承担。