#!/bin/bash

# 美好平台抽奖脚本测试运行脚本

echo "=== 美好平台抽奖脚本测试 ==="

# 设置测试环境变量
export MH_COOKIE="token=test_token;sessionId=test_session"
export MH_PHONE_NUMBERS="13800138000&13800138001"
export MH_USER_AGENT="Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15"
export LOTTERY_ADDRESS_IDS="addr1&addr2&addr3"
export MH_SMS_CODE="123456"
export MH_DEBUG="true"

echo "已设置测试环境变量"
echo "MH_COOKIE: $MH_COOKIE"
echo "MH_PHONE_NUMBERS: $MH_PHONE_NUMBERS"
echo "LOTTERY_ADDRESS_IDS: $LOTTERY_ADDRESS_IDS"
echo ""

# 运行测试脚本
echo "运行环境变量测试脚本..."
node test_env.js

echo ""
echo "=== 运行主抽奖脚本 ==="
node mh_lottery.js

echo ""
echo "=== 测试完成 ==="