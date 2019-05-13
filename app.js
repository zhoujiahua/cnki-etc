const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const swig = require("swig");
const comm = require("./comm/comm");
const md5 = require("md5");
const app = express();

//使用body-parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//node 允许跨域请求
app.all('*', function (req, res, next) {
    console.log(req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-type');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
    res.header('Access-Control-Max-Age', 1728000); //预请求缓存20天
    next();
});

//引入模块文件
const main = require("./routers/main");
const api = require("./routers/api");
const admin = require("./routers/admin");

//设置静态文件托管设置
app.use("/public", express.static(__dirname + "/public"));

//定义当前使用的模版引擎
app.engine("html", swig.renderFile);

//设置模版目录
app.set("views", "./views");

//注册使用模版引擎
app.set("view engine", "html");

// 开发过程中，需要取消模版缓存
swig.setDefaults({
    cache: false
});

//随机字符串
app.use((req, res, next) => {
    let num, str;
    //随机数
    function GetRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }
    num = GetRandomNum(1, 10);

    //随机字符串
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    function generateMixed(n) {
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }
    str = generateMixed(10);
    req.strCode = {
        num,
        str
    };
    next();
})

// 配置全局变量
// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.user = req.user || null;
//     next();
// })

//passport 
app.use(passport.initialize());
require("./config/passport")(passport);

//根据不同功能划分功能模块
app.use("/", main);
app.use("/api", api);
app.use("/admin", admin);

// catch 404
// app.use((req, res, next) => {
//     let err = new Error("Not Found");
//     err.status = 404;
//     next(err);
// })

// app.use((err, req, res, next) => {
//     res.status(err.status || 500);
//     res.render("msg/error.html", {
//         message: err.message,
//         error: {
//             title: "Error",
//             status: err.status,
//             desc: "不好意思你的页面被狗叼走了！"
//         }
//     });
// })

//连接数据库
mongoose.connect(comm.cnkietcDB, {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log("数据库连接失败！");
    } else {
        console.log("数据库连接成功！");
        //process.env.PORT：读取当前目录下环境变量port的值
        const port = process.env.PORT || 8088;
        app.listen(port, () => {
            console.log(`服务器启动成功正在监听：${port} 端口`);
        });
    }
});