const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = (passport) => {
    passport.use(new LocalStrategy({usernameField:"username"},(username, password, done)=>{
        User.findOne({username}).then((user)=>{
            if(!user){
                done(null,false,{message:"用户不存在！"});
            }
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err){ throw err}
                if(isMatch){
                    done(null,user);
                }else{
                    done(null,false,{message:"密码有误！"});
                }
            })
        })
    }));

    //序列化，用户提交后会把id作为唯一标识储存在session中，同时存储在用户的cookie中
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })

    //验证用户是否登录时需要用到这个，session根据id取回用户的登录信息并存储在req.user中
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user);
        })
    })

}