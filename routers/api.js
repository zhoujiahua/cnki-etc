const express = require("express");
const User = require("./../schemas/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const avatar = require("gravatar");
const router = express.Router();
const keys = require("./../config/keys");

//统一验证信息
let msgData;
router.use((req, res, next) => {
    msgData = {
        code: 0,
        msg: ""
    };
    next();
})

//登录
router.post("/login", (req, res, next) => {
    let r = req.body,
        toLowName = r.username.toLowerCase();
    User.findOne({
        username: toLowName
    }).then(userInfo => {
        if (!userInfo) {
            msgData.code = 1
            msgData.msg = "账户名不能为空！"
            res.json(msgData);
        }

        bcrypt.compare(r.password, userInfo.password, (err, isMatch) => {
            if (err) {
                throw err
            }
            console.log(isMatch)
            if (isMatch) {
                msgData.msg = "登录成功!";
                //加密规则
                const rule = {
                    _id: userInfo._id,
                    username: userInfo.username,
                    email: userInfo.email,
                    date: userInfo.date
                };
                jwt.sign(rule, keys.secretOrKey, {
                    expiresIn: 3600
                }, (err, token) => {
                    if (err) throw err;
                    msgData.token = "Bearer " + token;
                    res.json(msgData);
                })

            } else {
                msgData.code = 2;
                msgData.msg = "密码不正确！";
                res.json(msgData);
            }

        })
    })
})

//注册
router.post("/register", (req, res, next) => {
    let r = req.body;
    toLowName = r.username.toLowerCase();
    console.log("提交信息：", r);
    if (toLowName == "") {
        msgData.code = 4;
        msgData.msg = "用户名不能为空！";
        return res.json(msgData);
    }
    if (r.passwprd == "") {
        msgData.code = 5;
        msgData.msg = "密码不能为空！";
        return res.json(msgData);
    }
    if (r.passwprd != r.passwprd2) {
        msgData.code = 6;
        msgData.msg = "两次输入密码不一致！";
        return res.json(msgData);
    }
    if (r.email) {
        let reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!reg.test(r.email)) {
            msgData.code = 7;
            msgData.msg = "邮箱不合法！";
            return res.json(msgData);
        }
    }

    //数据查询
    User.findOne({
        username: toLowName
    }).then((userInfo) => {
        if (userInfo) {
            msgData.code = 7;
            msgData.msg = "当前用户已存在！";
            return res.json(msgData);
        }

        let newUser = new User({
            username: toLowName,
            password: r.password,
            email: r.email,
            avatar
        });

        //密码加密
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    throw err
                }
                //gravatar
                newUser.avatar = avatar.url(r.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                //password hash
                newUser.password = hash;

                //存储方法
                newUser.save().then(info => {
                        msgData.msg = "用户注册成功";
                        //加密规则
                        const rule = {
                            _id: info._id,
                            username: info.username,
                            email: info.email,
                            avatar: info.avatar,
                            date: info.date
                        };
                        jwt.sign(rule, keys.secretOrKey, {
                            expiresIn: 3600
                        }, (err, token) => {
                            if (err) throw err;
                            msgData.token = "Bearer " + token;
                            res.json(msgData);
                        })
                    })
                    .catch(err => {
                        msgData.code = 400;
                        msgData.msg = "用户注册失败";
                        res.json(msgData);
                    })
            })
        })
    })
})

//用户注销
router.get("/loginout", (req, res, next) => {
    res.send("success");
})

module.exports = router;