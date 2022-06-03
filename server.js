console.log("May node be with you!");
const express = require('express');
const uploader = require('express-fileupload');
const app = express();
const cors = require('cors');
const session = require('express-session')
const { authenticator } = require('./middleware/auth')

app.use(cors({
  origin: '*'
}));

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))



// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

// 放在 UsePassport(app)後面
app.use((req, res, next) => {
  // 把 req.isAuthenticated() 回傳的布林值，交接給 res 使用
  res.locals.isAuthenticated = req.isAuthenticated() 
  // 反序列化時取得的 user 資訊
  console.log(res.locals.isAuthenticated);
  res.locals.user = req.user
  next()
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(uploader());

const db = require("./models/index");
db.mongoose
  .connect(db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const dataRouter = require("./routes/dataRoutes.js");
const fileRouter = require("./routes/fileRoutes")
const userRouter = require("./routes/userRoutes")
const codeRouter = require("./routes/codeRoutes")


app.get('/', authenticator,(req, res) => {
  res.sendFile(__dirname + '/index.html')
});



app.use("/file", fileRouter)
app.use("/data", dataRouter)
app.use("/user", userRouter)
app.use("/code", codeRouter)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
