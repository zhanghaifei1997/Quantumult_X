$notify('执行红旗智联cookie脚本')
const Name = '红旗智联'
const hqzlKeyName = 'hqzl_key'
const hqzlTokenName = 'hqzl_token'
const hqzlUserIdName = 'hqzl_userId'

const hqzl = init()

const requrl = $request.url
// $notify('准备判断请求方式')
if ($request && $request.method != 'OPTIONS') {
	// $notify('进入判断')
	// $notify('进入判断', $request.headers)
	const hqzlKey = $request.headers.Cookie
	const hqzlToken = $request.headers.Authorization
	const hqzlUserId = $request.headers.aid
	// const hqzlToken = JSON.stringify($request.headers)

	hqzl.log(`hqzlKey:${hqzlKey}`)
	hqzl.log(`hqzlToken:${hqzlToken}`)
	hqzl.log(`hqzlUserId:${hqzlUserId}`)

	if (hqzlKey) hqzl.setdata(hqzlKey, hqzlKeyName)
	if (hqzlToken) hqzl.setdata(hqzlToken, hqzlTokenName)
	if (hqzlUserId) hqzl.setdata(hqzlUserId, hqzlUserIdName)

	hqzl.msg(Name, `获取Cookie: 成功`, ``)
	$notify(hqzlKeyName, `获取: 成功`, hqzlKey)
	$notify(hqzlTokenName, `获取: 成功`, hqzlToken)
	$notify(hqzlUserIdName, `获取: 成功`, hqzlUserId)
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
hqzl.done()



