// 设置cookie
export function SetCookie (name, value, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = name + '=' + value + '; ' + expires
}

// 获取cookie
export function GetCookie (name) {
  var sysCookie = document.cookie.split(';')
  for (var i = 0; i < sysCookie.length; i++) {
    var cookieItem = sysCookie[i].trim()
    if (cookieItem.indexOf(name) >= 0) {
      return cookieItem.substring(name.length + 1, cookieItem.length)
    }
  }
  return ''
}
