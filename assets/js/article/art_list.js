$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }
    // 定义查询对象，将来请求数据的时候，需要把请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '',  // 文章分类的Id
        state: '' // 文章的发布状态
    }

    // 获取文章列表数据的函数
    initTable()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // layer.msg('获取文章列表成功！')  
                // 使用模版引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据是失败！')
                }
                // 调用模版引擎渲染分类的可选项
                // console.log(res);
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知 layui 重新渲染表单区域的 UI 结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', // 分页容器的id
            count: total,   // 总数据条数
            limit: q.pagesize,  // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调函数
            // 触发 jump 回调的方式有两种
            // 方式1: 点击分页页码时
            // 方式2: 只要调用 laypage.render() 方法，就会回调
            // 方式3: 选择每页展示几条数据时也会触发 jump 回调
            jump: function (obj, first) {
                // console.log(first); // 方式2调用 jump 回调时，first 的值为 true，否则时方式1触发的
                // console.log(obj.curr);  // 最新的页码值
                // 把最新的页码值复制给 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，复制给 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的方式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取当前页面删除按钮的数据
        var len = $('.btn-delete').length
        // 获取文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            // do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前也是否还有剩余的数据
                    // 如果没有剩余的数据，则让页码值 -1 
                    // 然后再重新调用 initTable() 渲染页面数据
                    if (len = 1) {
                        // 如果 len 的值等于1，说明删除完成后，页面上就没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})