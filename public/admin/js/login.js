(function () {
    alert("")
    layui.use(["layer", "laydate", "form", "element"], function () {
        var layer = layui.layer,
            // laydate = layui.laydate,
            // form = layui.form,
            // element = layui.element,
            device = layui.device(),
            $ = layui.jquery;

        $(".device").text("您当前的操作系统为：" + device.os);
        $("#loginBnt").on("click", loginBox);
        $("#registerBtn").on("click", registerBox);

        //登录模块
        function loginBox() {
            layer.open({
                skin: "login-class",
                type: 1,
                title: "<h3>登录</h3>", //不显示标题栏
                closeBtn: 1,
                area: "360px",
                shade: 0.8,
                id: 'loginbox', //设定一个id，防止重复弹出
                btn: ['马上登录'],
                btnAlign: 'c',
                moveType: 1, //拖拽模式，0或者1
                content: $("#loginHtml").html(),
                success: function (layero, index) {
                    $(".layui-layer-btn-c a").addClass("layui-btn layui-btn-fluid");
                    $('[name="username"]').focus();

                    $('[name="username"]').blur(function (e) {
                        var values = $(this).val().trim();
                        if (values.length < 3) {
                            layer.msg("用户名不能为空并且不能小于3位");
                            return false;
                        }
                    });

                    $('[name="password"]').blur(function (e) {
                        var values = $(this).val().trim();
                        if (values.length < 3) {
                            layer.msg("密码不能不能为空并且不能小于3位");
                            return false;
                        }
                    });

                    $(".login-link a").on("click", function () {
                        registerBox();
                        layer.close(index);
                    })
                    $(".reg-link a").on("click", function () {
                        loginBox();
                        layer.close(index);
                    })
                    $(".repass-link a").on("click", function () {
                        repassBox();
                        layer.close(index);
                    });
                },
                yes: function (index) {
                    var uname = $('[name="username"]').val().trim(),
                        upass = $('[name="password"]').val().trim(),
                        loadTip;
                    if (uname.length < 3 || upass.length < 3) {
                        layer.msg("用户名和密码不能为空并且不能小于3位！");
                        return false;
                    }

                    $.ajax({
                        type: "POST",
                        url: "/api/login",
                        data: {
                            username: uname,
                            password: upass
                        },
                        dataType: "json",
                        beforeSend: function () {
                            loadTip = layer.load();
                            console.log("数据正在提交");
                        },
                        success: function (res) {
                            if (res.code) {
                                layer.msg(res.msg);
                                layer.close(loadTip);
                                return false;
                            }
                            var timer = setTimeout(function () {
                                clearTimeout(timer);
                                layer.msg("登录成功");
                                layer.close(index);
                                layer.close(loadTip);
                                window.location.reload();
                            }, 600)
                        },
                        complete: function () {
                            console.log("数据提交完成");
                        },
                        error: function () {}
                    });

                }
            });
        }

        //注册模块
        function registerBox() {
            layer.open({
                skin: "register-class",
                type: 1,
                title: "<h3>注册</h3>", //不显示标题栏
                closeBtn: 1,
                area: "360px",
                shade: 0.8,
                id: 'registerbox', //设定一个id，防止重复弹出
                btn: ['立即注册'],
                btnAlign: 'c',
                moveType: 1, //拖拽模式，0或者1
                content: $("#registerHtml").html(),
                success: function (layero, index) {
                    $(".layui-layer-btn-c a").addClass("layui-btn layui-btn-fluid");
                    $('[name="setname"]').focus();
                    $('[name="setname"]').blur(function () {
                        var values = $(this).val().trim();
                        if (values.length < 3) {
                            layer.msg("用户名不能为空并且不能小于3位");
                            return false;
                        }
                    })
                    $('[name="setpass"]').blur(function () {
                        var values = $(this).val().trim();
                        if (values.length < 3) {
                            layer.msg("密码不能为空并且不能小于3位");
                            return false;
                        }
                    })
                    $('[name="setrepass"]').blur(function () {
                        var values = ($(this).val().trim() == $('[name="setpass"]').val().trim());
                        if (!values) {
                            layer.msg("两次密码不一致！");
                            return false;
                        }
                    })
                    $(".reg-link a").on("click", function () {
                        layer.close(index);
                        loginBox();
                    })
                },
                yes: function (index) {
                    var setname = $('[name="setname"]').val().trim(),
                        setpass = $('[name="setpass"]').val().trim(),
                        setrepass = $('[name="setrepass"]').val().trim(),
                        loadTip;
                    if (setname.length < 3 || setpass.length < 3 || setrepass.length < 3) {
                        layer.msg("注册信息不能为空并且不能小于3位！");
                        return false;
                    }
                    if (setpass != setrepass) {
                        layer.msg("两次密码不一致！");
                        return false;
                    }

                    $.ajax({
                        type: "POST",
                        url: "/api/register",
                        data: {
                            setname: setname,
                            setpass: setpass,
                            setrepass: setrepass
                        },
                        dataType: "json",
                        beforeSend() {
                            console.log("数据提交中");
                            loadTip = layer.load();
                        },
                        success: function (res) {
                            if (res.code) {
                                layer.msg(res.msg);
                                layer.close(loadTip);
                                return false;
                            }
                            var timer = setTimeout(function () {
                                clearTimeout(timer);
                                layer.msg(res.msg);
                                layer.close(loadTip);
                                layer.close(index);
                                window.location.reload();
                            }, 600)
                        },
                        complete: function () {
                            console.log("数据提交完成");
                        },
                        error: function () {}
                    });
                }
            });
        }

        //找回密码
        function repassBox() {
            layer.open({
                skin: "login-class",
                type: 1,
                title: "<h3>重置密码</h3>", //不显示标题栏
                closeBtn: 1,
                area: "360px",
                shade: 0.8,
                id: 'emailbox', //设定一个id，防止重复弹出
                btn: ['重置密码'],
                btnAlign: 'c',
                moveType: 1, //拖拽模式，0或者1
                content: $("#repassHtml").html(),
                success: function (layero, index) {
                    $(".layui-layer-btn-c a").addClass("layui-btn layui-btn-fluid");
                    $('[name="reemail"]').focus();
                    $('[name="reemail"]').blur(function () {
                        var values = $(this).val().trim();
                        if (!checkEmail(values)) {
                            layer.msg("邮箱格式不正确！");
                            return false;
                        } else if (values == "") {
                            layer.msg("邮箱地址不能为空!");
                            return false;
                        }
                    })
                    $(".login-link a").on("click", function () {
                        registerBox();
                        layer.close(index);
                    })
                    $(".reg-link a").on("click", function () {
                        loginBox();
                        layer.close(index);
                    })
                },
                yes: function (index) {
                    var reemail = $('[name="reemail"]').val().trim();
                    if (reemail == "") {
                        layer.msg("邮箱地址不能为空！");
                        return false;
                    } else if (!checkEmail(reemail)) {
                        layer.msg("邮箱格式不正确！");
                        return false;
                    }
                    var loadTip = layer.load();
                    var timer = setTimeout(function () {
                        clearTimeout(timer);
                        layer.msg("邮件发送成功！");
                        layer.close(loadTip);
                        layer.close(index);
                    }, 800)
                }
            });
        }

        //邮箱验证
        function checkEmail(o) {
            var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
            if (reg.test(o)) {
                return true;
            }
            return false;
        }

    })
}())