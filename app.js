const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()
const port = process.env.PORT || 3000

// 引入 users.js
const users = require('./routes/users')

// 数据库配置文件
const db = require('./configs/configs').mongoURI

// 使用body-parser中间件\
app.use((req, res, next) => {
    // 注意：如果跨域请求中涉及到cookie信息传递，值不可以为*号 比如是具体的域名信息
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    if (req.method == 'OPTIONS') { res.send(200) } else { next() };

})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// 连接MongoDB数据库
mongoose.connect(db).then(() => {
    console.log('MongoDB Connected')
}).catch((err) => {
    console.log(err)
})

//passport 初始化
app.use(passport.initialize());
require('./configs/passport')(passport);

app.get('/', (req, res) => {
    res.json('hello')
})

// 使用 routes
app.use('/users', users)

app.listen(port, () => {
    console.log(`Server is running  http://localhost:8080/ on port ${port}`)
})