$(function () {
    var layer = layui.layer
    var form = layui.form
    // 定义加载文章类别的方法
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                // layer.msg('获取文章分类成功！')
                // 利用模版引擎渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 调用 form.render() 方法重新渲染数据
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 给文件选择框绑定 change 事件
    $('#coverFile').on('change', function (e) {
        // console.log(e);
        // 判断用户是否选择了文件
        if (e.target.files === 0) {
            return
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]

        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)

        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    // 定义文章的发布状态，默认为已发布，当点击存为草稿时，修改为 草稿
    var art_state = '已发布'

    // 存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 创建FormData 对象
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存到 fd 中
        fd.append('state', art_state)

        // 将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到 fd 中
                fd.append('cover_img', blob)
                // 发起ajax 数据请求，提交数据
                publishArticle(fd)
            })
    })
    // 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是 formdata 格式的数据，必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功之后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})