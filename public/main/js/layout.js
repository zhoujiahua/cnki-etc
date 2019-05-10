(function () {
    layui.use(["layer", "element", "form"], function () {
        var layer = layui.layer,
            element = layui.element,
            form = layui.form,
            device = layui.device(),
            $ = layui.$;
        $(".device").text("您当前的操作系统为：" + device.os);
        var token = localStorage.getItem("token");
        if (token) {
            $.ajax({
                type: "GET",
                url: "/index",
                data: {},
                contentType:"application/json",
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", token);
                },
                success: function (res) {
                    // debugger
                    console.log(res)
                }
            });
        }

    });
}())