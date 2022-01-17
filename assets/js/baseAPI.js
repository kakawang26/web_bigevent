// 每次调用ajax函数( $.get() $.post() $.ajax() )都会先调用这个函数
// 在这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的 ajax 请求之前，统一拼接请求的根路径
    options.url = "http://www.liulongbin.top:3007" + options.url
    // 统一为有权限的接口设置 headers 请求头部配置
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // 在complete 函数中可以用 res.responseJSON 可以拿到服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空 token
            localStorage.removeItem('token')
            // 强制跳转到登录页
            location.href = '/login.html'
        }
    }
})