(function () {
    layui.use(["layer"], function () {
        var layer = layui.layer,
            $ = layui.$;

        //注销
        $("#loginOut").on("click", function () {
            var loadTip = layer.load();
            $.getJSON("/api/loginout", {},
                function (res) {
                    if (!res.code) {
                        var timer = setTimeout(function () {
                            clearTimeout(timer);
                            layer.msg(res.msg);
                            layer.close(loadTip);
                            window.location.reload();
                        }, 600)
                    }
                }
            );

        });
    })

}())