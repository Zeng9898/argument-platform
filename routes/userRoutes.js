// 載入 Express 和 express.Router
const express = require('express')
const router = express.Router()
const User = require("../models/user.model")
// 引用 passport
const passport = require('passport')

// 路由 : 登入頁面 GET
router.get('/login', (req, res) => {
    //res.render('login')
    res.sendFile(__dirname + '/login.html')
})
// 路由 : 註冊頁面 GET
router.get('/register', (req, res) => {
    //res.render('register')
    res.sendFile(__dirname + '/register.html')
})

// 登入 POST 路由
// 加入 middleware，驗證 request 登入狀態
router.post('/login', passport.authenticate('local'),
    function (req, res) {
        res.send({
            success:"login success",
            userInfo: req.user
        })
    })
// 登出 GET 路由
router.get('/logout', (req, res) => {
    req.logout()
    res.send("logout success!")
})

router.post('/register', (req, res) => {
    // 取得使用者註冊資料
    console.log(req.body)
    const { name, unit, account, password, confirmPassword } = req.body
    // 檢查該信箱是否已經註冊
    User.findOne({ account: account }).then(user => {
        // 如果已經註冊：退回原本畫面
        if (user) {
            console.log('這個信箱已經被註冊過了')
            res.send("註冊過了！")
        } else {
            // 如果還沒註冊：寫入資料庫
            return User.create({
                name,
                unit,
                account,
                password
            })
                .then(() => res.redirect('/user/login'))
                .catch(err => console.log(err))
        }
    })
})
module.exports = router