// @login $ register
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../configs/configs')
const passport = require('passport')
const User = require('../models/User')
    // 测试api
router.get('/test', (req, res) => {
    res.json({ msg: 'test works' })
})

// $router POST users/register
// @desc 返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
    console.log(req.body)
        // console.log('jjj');
        // 查询数据库中是否存在注册时手机号
    User.findOne({ phone: req.body.phone }).then(user => {
        if (user) {
            console.log('sss');
            // 根据status状态，通知不同情况的信息
            return res.status(201).send('手机已被注册!')
        } else {
            console.log('hh');
            const newUser = new User({
                username: req.body.username,
                phone: req.body.phone,
                password: req.body.password,
            })
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err
                    newUser.password = hash
                    newUser.save().then(user => {
                        res.json(user)
                    }).catch(err => {
                        console.log(err)
                    })
                })
            })
        }
    })
})

// $router POST users/login
// @desc 返回token
// @access public
router.post('/login', (req, res) => {
    const phone = req.body.phone
    const password = req.body.password
        //查询数据库
    User.findOne({ phone }).then(user => {
        if (!user) {
            return res.status(202).send('用户不存在！')
        }
        // 密码匹配
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const rule = {
                    id: user.id,
                    username: user.username,
                }
                jwt.sign(rule, 'secret', { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                })
            } else {
                return res.status(400).json('密码错误！')
            }
        })
    })
})

// $router GET users/current
// @desc return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        phone: req.user.phone,
        password: req.user.password,
        createdDate: req.user.createdDate
    })
})


module.exports = router