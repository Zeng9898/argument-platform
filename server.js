console.log("May node be with you!");
const express = require('express');
const uploader = require('express-fileupload');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const DiscussData = require("./models/discussData")
const mongoose = require("mongoose")

app.use(cors({
  origin: '*'
}));

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

require("./routes/route.js")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});


app.post('/', (req, res) => {
  if (req.files) {
    console.log(req.files);
    var file = req.files.file;
    var fileName = file.name;
    console.log(fileName);
    file.mv('./uploads/' + fileName, function (err) { //把檔案移動到/uploads
      if (err) {
        res.send(err);
      } else {
        res.send("File Uploaded");
        const wb = xlsx.readFile("./uploads/" + fileName); //讀取xlsx檔案
        //console.log(wb.SheetNames);
        const ws = wb.Sheets['設定格式化的條件(前)'];  //讀取workbook中的其中一個sheet
        //console.log(ws);
        const data = xlsx.utils.sheet_to_json(ws); //用xlsx套件將sheet轉json
        data.forEach((item) => {
          const newData = new DiscussData({ //將每筆json存入discussData表
            dataName: item.dataName
          });
          // newData.history.push({
          //   userId:"testUserId",

          // });
          newData.save()
            .then((value) => {
              console.log(value)
            })
            .catch(value => console.log(value));
        })
      }
    });
  }
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