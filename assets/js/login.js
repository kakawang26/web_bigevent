$(function () {
    // 点击 ‘去注册账号’
    $('#link_reg').on('click', function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })

    // 点击 ‘去登录’
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义校验规则
    // 从layui中获取 form 对象
    var form = layui.form
    var layer = layui.layer
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义名为 pwd 的及校验规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须是6到12个字符，且不能出现空格'
        ],

        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 行参是确认密码框的内容
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')

            // 注册成功后，自动跳转到登录页面
            $('#link_login').click()
        })
    })

    // 监听登录表单的登录事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        var data = {
            username: $('#form_login [name=username]').val(),
            password: $('#form_login [name=password]').val()
        }
        $.post('/api/login', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('登录成功')
            // 把登录成功的 token 字符串保存到localStorage 中
            localStorage.setItem('token', res.token)
            // 跳转到后台主页
            location.href = '/index.html'
        })
    })



})