// 載入相關模組
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require("../models/user.model")
module.exports = app => {
    // 初始化 Passport 模組
    app.use(passport.initialize())
    app.use(passport.session())
    // 設定本地登入策略
    passport.use(new LocalStrategy({ usernameField: 'account' }, (account, password, done) => {
        User.findOne({ account })
            .then(user => {
                if (!user) {
                    console.log("1");
                    return done(null, false, { message: 'That account is not registered!' })
                }
                if (user.password !== password) {
                    console.log("2");
                    return done(null, false, { message: 'account or Password incorrect.' })
                }
                console.log("3");
                return done(null, user)
            })
            .catch(err => done(err, false))
    }))
    // 設定序列化與反序化
    passport.serializeUser((user, done) => {
        console.log("4");
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        console.log("5");
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}