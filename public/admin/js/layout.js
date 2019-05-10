(function () {
    layui.use('element', function () {
        var layer = layui.layer,
            element = layui.element,
            $ = layui.$;

        //左侧下拉
        var sideUl = $(".side .layui-nav");
        sideUl.on("click", "li", function () {
            sideUl.find("li").removeClass("layui-nav-itemed");
            $(this).addClass("layui-nav-itemed");
        })

    });
}())