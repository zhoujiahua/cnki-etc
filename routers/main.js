const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/index", passport.authenticate("jwt", {
    session: true
}), (req, res) => {
    res.json({
        _id: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        date: req.user.date
    });
})

router.get("/", (req, res, next) => {
    res.render("main/index");
})

module.exports = router;