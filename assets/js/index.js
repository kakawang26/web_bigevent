$(function () {
    // 调用函数，获取用户基本信息
    getUserInfo()
    var layer = layui.layer

    //  点击按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 用户点击确定后的操作
            // 清除本地存储中的 token
            localStorage.removeItem('token')
            // 重新跳转到登录页
            location.href = '/login.html'
            // 关闭confirm询问框
            layer.close(index)
        })
    })
})


// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用函数渲染用户头像
            renderAvatar(res.data)
        },
        // 不论成功还是失败都会调用 complete 函数
        // complete: function (res) {
        //     // 在complete 函数中可以用 res.responseJSON 可以拿到服务器响应的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空 token
        //         localStorage.removeItem('token')
        //         // 强制跳转到登录页
        //         location.href = '/login.html'
        //     }
        // }
    })
}

//  渲染用户的头像
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').prop('src', user.user_pic).show()
        $('.test-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.test-avatar').html(first).show()
    }
}