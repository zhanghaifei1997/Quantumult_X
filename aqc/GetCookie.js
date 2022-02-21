$notify('执行爱企查cookie脚本')

// const $ = new Env('爱企查');

const Name = '爱企查'
const aqcckName = 'aqcck'

const aqc = init()



//获取ck
//原始链接：https://aiqicha.baidu.com/zxcenter/cumulativeSignInAjax
// function aqchqck() {
// 	if ($request.url.indexOf("cumulativeSignInAjax") > -1) {
// 		const aqcck = $request.headers["Cookie"]
// 		if (aqcck) $.setdata(aqcck, `aqcck${status}`)
// 		$.log(aqcck)
// 		$.msg($.name, "", `爱企查${status}获取Cookie成功`)
// 	}
// }


const requrl = $request.url
// $notify('准备判断请求方式')
if ($request && $request.method != 'OPTIONS') {
	// $notify('进入判断')
	// $notify('进入判断', $request.headers)
	const aqcckKey = $request.headers.Cookie
	
	// const hqzlToken = JSON.stringify($request.headers)

	aqc.log(`aqcckKey:${aqcckKey}`)
	

	if (aqcckKey) aqc.setdata(aqcckKey, aqcckName)
	

	aqc.msg(Name, `获取Cookie: 成功`, ``)
	$notify(aqcckName, `获取: 成功`, aqcCk)
	
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
			$task.fetch(url).then((resp) => cb(null, {}, resp.body))
		}
	}
	post = (url, cb) => {
		if (isSurge()) {
			$httpClient.post(url, cb)
		}
		if (isQuanX()) {
			url.method = 'POST'
			$task.fetch(url).then((resp) => cb(null, {}, resp.body))
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
aqc.done()
