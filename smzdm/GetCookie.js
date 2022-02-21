$notify('执行什么值得买cookie脚本')
const Name = '什么值得买'
const smzdmKeyName = 'smzdm_key'

const smzdm = init()

const requrl = $request.url
// $notify('准备判断请求方式')
if ($request && $request.method != 'OPTIONS') {
	// $notify('进入判断')
	// $notify('进入判断', $request.headers)
	const smzdmKey = $request.headers.Cookie
	
	

	smzdm.log(`smzdmKey:${smzdmKey}`)
	

	if (smzdmKey) smzdm.setdata(smzdmKey, smzdmKeyName)
	

	smzdm.msg(Name, `获取Cookie: 成功`, ``)
	$notify(smzdmKeyName, `获取: 成功`, smzdmKey)

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
smzdm.done()



