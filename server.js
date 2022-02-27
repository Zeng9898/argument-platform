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

const db = require("./models");
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

// app.post('/', (req, res) => {
//   const {userName} = req.body;
//   const newUser = new UserProfile({
//     userName:userName,
//   });
//   newUser.save()
//     .then((value) => {
//       console.log(value);
//       res.send({ok:"ok"});
//     })
//     .catch(value => console.log(value));
// });

// app.post('/', (req, res) => {
//   if (req.files) {
//     console.log(req.files);
//     var file = req.files.file;
//     var fileName = file.name;
//     console.log(fileName);
//     file.mv('./uploads/' + fileName, function (err) { //把檔案移動到/uploads
//       if (err) {
//         res.send(err);
//       } else {
//         res.send("File Uploaded");
//         const wb = xlsx.readFile("./uploads/" + fileName); //讀取xlsx檔案
//         //console.log(wb.SheetNames);
//         const ws = wb.Sheets['設定格式化的條件(前)'];  //讀取workbook中的其中一個sheet
//         //console.log(ws);
//         const data = xlsx.utils.sheet_to_json(ws); //用xlsx套件將sheet轉json
//         data.forEach((item) => {
//           const newData = new DiscussData({ //將每筆json存入discussData表
//             dataName: item.dataName
//           });
//           // newData.history.push({
//           //   userId:"testUserId",

//           // });
//           newData.save()
//             .then((value) => {
//               console.log(value)
//             })
//             .catch(value => console.log(value));
//         })
//       }
//     });
//   }
// });

app.use("/file", fileRouter)
app.use("/data", dataRouter)
app.use("/user", userRouter)
app.use("/code", codeRouter)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
// app.route("/upload_excel")
//   .post(upload.any(), (req, res) => {
//     // if (!req.files || req.files.length === 0) {
//     //   return res.json({ text: '请选择文件上传' })
//     // }
//     console.log(req.files);
//     const { originalname, buffer } = req.files[0]
//     if (!originalname.endsWith('xls') && !originalname.endsWith('xlsx')) {
//       return res.json({ text: '请上传xls或xlsx格式的文件' })
//     }
//     // 解析excel文件
//     const workbook = xlsx.read(buffer, { type: "buffer" })
//     const sheet = workbook.Sheets[workbook.SheetNames[0]] // 选择第一个工作簿
//     const result = xlsx.utils.sheet_to_json(sheet)

//     return res.json(result)
//   })