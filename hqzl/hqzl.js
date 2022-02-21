const chavy = init()
const Name = 'CSDN'
const hqzlKeyName = 'hqzl_key'
const hqzlTokenName = 'hqzl_token'
const hqzlUserIdName = 'hqzl_userId'
// const hqzlUserIdName = 'hqzl_userId'


const LotteryList = [{
		name: "5积分",
		value: 9
	},
	{
		name: "10积分",
		value: 8
	},
	{
		name: "20积分",
		value: 7
	},
	{
		name: "888积分",
		value: 5
	},
	{
		name: "999积分",
		value: 4
	}
]
// {
// 	name: "国庆车贴",
// 	value: 6
// }
// , 
// {
// 	name: "茶枕头",
// 	value: 33
// },
// {
// 	name: "雪铲",
// 	value: 3
// },
// {
// 	name: "后备箱收纳箱",
// 	value: 2
// },
// {
// 	name: "车载应急电源",
// 	value: 1
// }
const signinfo = {}
let VAL_Key = chavy.getdata(hqzlKeyName)
let VAL_hqzlToken = chavy.getdata(hqzlTokenName)
let VAL_UserId = chavy.getdata(hqzlUserIdName);

// if(VAL_Key==null||VAL_Key==undefined){
// 	chavy.log(`⚠ ${Name} : 请先获取 Cookies`)

// }
// if(VAL_hqzlToken==null||VAL_hqzlToken==undefined){
// 	chavy.log(`⚠ ${Name} : 请先获取 Cookies`)
// }
// if(VAL_UserId==null||VAL_UserId==undefined){
// 	chavy.log(`⚠ ${Name} : 请先获取 Cookies`)
// }
(sign = async () => {
	chavy.log(`🔔 ${Name}`)
	await TurntableLottery()
	// await signapp()
	// await getlucky()
	// for (let i = 0; i < signinfo.lucky.data.drawTimes; i++) {
	// 	await luckyapp()
	// }
	// showmsg()
})()
.catch((e) => chavy.log(`❌ ${Name} 签到失败: ${e}`))
	.finally(() => chavy.done())

function TurntableLottery() {
	return new Promise((resolve, reject) => {
		const url = {
			url: 'https:hqzjds-hq.faw.cn/hongqi925/award/addAwardRecord',
			// headers: {}
		}
		url.headers['Host'] = 'hqzjds-hq.faw.cn'
		url.headers['Origin'] = 'https://hqzjds-hq.faw.cn'
		url.headers['Content-Type'] = 'application/json'
		url.headers['Accept-Language'] = 'zh-CN,zh-Hans;q=0.9'
		url.headers['Accept-Encoding'] = 'gzip, deflate, br'
		url.headers['Connection'] = 'keep-alive'
		url.headers['Accept'] = 'application/json, text/plain, */*'
		url.headers['User-Agent'] =
			'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
		url.headers['Authorization'] = VAL_hqzlToken
		url.headers['Referer'] = 'https://hqzjds-hq.faw.cn/dist/'

		let listKey = Math.floor(Math.random() * LotteryList.length + 1) - 1;

		url.body = {
			"prize": LotteryList[listKey].value,
			"prizeName": LotteryList[listKey].name,
			// "vin": VAL_UserId,
			// "vin": "",

		}

		// url.headers['Content-Length'] = '60'
		chavy.post(url, (error, response, data) => {
			try {
				chavy.msg(Name, `抽一次成功`, `说明:`+data)
				// signinfo.loginapp = JSON.parse(data)
				// updateSignAppCookies()
				resolve()
			} catch (e) {
				chavy.msg(Name, `登录结果: 失败`, `说明: ${e}`)
				chavy.log(`❌ ${Name} loginapp - 登录失败: ${e}`)
				chavy.log(`❌ ${Name} loginapp - response: ${JSON.stringify(response)}`)
				resolve()
			}
		})
	})
}


function init() {
	isSurge = () => {
		return undefined === this.$httpClient ? false : true
	}
	isQuanX = () => {
		return undefined === this.$task ? false : true
	}
	getdata = (key) => {
		if (isSurge()) return $persistentStore.read(key)
		if (isQuanX()) return $prefs.valueForKey(key)
	}
	setdata = (key, val) => {
		if (isSurge()) return $persistentStore.write(key, val)
		if (isQuanX()) return $prefs.setValueForKey(key, val)
	}
	msg = (title, subtitle, body) => {
		if (isSurge()) $notification.post(title, subtitle, body)
		if (isQuanX()) $notify(title, subtitle, body)
	}
	log = (message) => console.log(message)
	get = (url, cb) => {
		if (isSurge()) {
			$httpClient.get(url, cb)
		}
		if (isQuanX()) {
			url.method = 'GET'
			$task.fetch(url).then((resp) => cb(null, resp, resp.body))
		}
	}
	post = (url, cb) => {
		if (isSurge()) {
			$httpClient.post(url, cb)
		}
		if (isQuanX()) {
			url.method = 'POST'
			$task.fetch(url).then((resp) => cb(null, resp, resp.body))
		}
	}
	done = (value = {}) => {
		$done(value)
	}
	return {
		isSurge,
		isQuanX,
		msg,
		log,
		getdata,
		setdata,
		get,
		post,
		done
	}
}
