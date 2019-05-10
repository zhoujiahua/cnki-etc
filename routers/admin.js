const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("./../schemas/User");

//权限验证
// router.use((req, res, next) => {
//     if (!req.userInfo.isAdmin) {
//         res.render("msginfo/index", {
//             msg: "对不起您没足够的访问权限！"
//         });
//         return
//     }
//     next();
// })

//后台首页
router.get("/", passport.authenticate("jwt", {
    session: true
}), (req, res, next) => {
    res.render("admin/index", {
        userInfo: req.userInfo
    });
})

//用户管理
router.get("/user", (req, res, next) => {
    let page = req.query.page || 1,
        limit = 2,
        skip = (page - 1) * limit;
    User.find().limit(2).skip(skip).then((users) => {
        res.render("admin/user_index", {
            userInfo: req.userInfo,
            users: users
        });
    })
})

router.get("/amd", passport.authenticate("jwt", {
    session: true
}), (req, res) => {
    res.send(req.user);
})

module.exports = router;