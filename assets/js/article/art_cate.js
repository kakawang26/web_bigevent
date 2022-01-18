$(function () {
    var layer = layui.layer
    var form = layui.form
    // 获取文章分类列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        // 打开一个弹出层
        indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,  // 默认为0，代表提示层，默认有确定按钮，改为1后，代表页面层，没有确定按钮了
            area: ['500px', '250px'],  // 设置宽高
            content: $('#dialog-add').html()
        })
    })
    // 通过代理的形式为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败！')
                }
                initArtCateList()
                layer.msg('添加文章分类成功！')
                // 弹出层自动关闭,根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式给编辑按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            title: '修改文章分类',
            type: 1,  // 默认为0，代表提示层，默认有确定按钮，改为1后，代表页面层，没有确定按钮了
            area: ['500px', '250px'],  // 设置宽高
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        // 发起请求，获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 快速给表单填充值
                form.val('form-edit', res.data)
            }
        })
    })

    //  通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 询问用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 调用 ajax 函数发起删除数据请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })



    
})