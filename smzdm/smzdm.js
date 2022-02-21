const chavy = init()
const Name = '【什么值得买】'
const smzdmKeyName = 'smzdm_key'



let VAL_Key = chavy.getdata(smzdmKeyName)



(sign = async () => {
	chavy.log(`🔔 ${Name}`)
	await smzdm()

})()
.catch((e) => chavy.log(`❌ ${Name} 签到失败: ${e}`))
	.finally(() => chavy.done())



function smzdm() {
	return new Promise((resolve, reject) => {
		const url = {
			url: 'https://zhiyou.smzdm.com/user/checkin/jsonp_checkin?callback=&_=',

		}

		url.headers['cookie'] = VAL_Key
		url.headers['Referer'] = 'https://www.smzdm.com/'

		chavy.post(url, (error, response, data) => {
			try {
				chavy.msg(Name, `成功`, `说明:` + data)
				chavy.msg(Name, `成功`, `说明:` + data)
				if (data.error_code == 0) {
					data =
						`签到成功! 签到天数: ${data.data.checkin_num} | Lv:${data.data.rank} | 经验值:${data.data.exp}`;
				} else {
					data = data.error_msg;
				}
				chavy.msg(Name, data)
				resolve()
			} catch (e) {
				chavy.msg(Name, `失败`, `说明: ${e}`)
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
