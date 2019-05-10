const mongoose = require("mongoose");
const User = mongoose.model("users");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require("./keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload._id).then((user) => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, {
                    msg: "当前用户存在"
                });
            }
        }).catch((err) => {
            console.log(err);
        })
    }))

    //序列化，用户提交后会把id作为唯一标识储存在session中，同时存储在用户的cookie中
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    //验证用户是否登录时需要用到这个，session根据id取回用户的登录信息并存储在req.user中
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
}