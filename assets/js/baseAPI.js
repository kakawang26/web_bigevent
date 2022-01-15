// 每次调用ajax函数( $.get() $.post() $.ajax() )都会先调用这个函数
// 在这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的 ajax 请求之前，统一拼接请求的根路径
    options.url = "http://www.liulongbin.top:3007" + options.url
})