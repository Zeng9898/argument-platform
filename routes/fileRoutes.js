const express = require("express")
const router = express.Router()
const xlsx = require('xlsx');
const xl = require('excel4node');
const DiscussData = require("../models/discussData.model")
const UserProfile = require("../models/userProfile.model")
const File = require("../models/file.model")
const CodeSys = require("../models/codeSys.model")
const mongoose = require('mongoose');

const fs = require("fs");

router.get('/allFile/:userId', (req, res) => {
    const userId = req.params.userId
    File.find({ userId: userId }).then(
        file => {
            res.send(file);
        }
    ).catch((err) => {
        return res.status(500).send({
            file: err || "Some error occurred while retrieving files.",
        });
    })
});




router.post('/', (req, res) => {
    const { userId, fileName, collector, sourceTarget,
        age, headCounts, collectDate, collectMethod, context } = req.body;
    console.log(req.body)
    if (req.files) {
        console.log(req.files);
        var file = req.files.file;
        file.mv('./uploads/' + fileName, function (err) { //把檔案移動到/uploads
            if (err) {
                console.log("1")
                console.log(err)
                res.send(err);
            } else {
                let fileId;
                console.log("2")
                const newFile = new File({
                    userId: userId,
                    fileName: fileName,
                    collector: collector,
                    sourceTarget: sourceTarget,
                    age: age,
                    headCounts: headCounts,
                    collectDate: collectDate,
                    collectMethod: collectMethod,
                    context: context
                });
                newFile.save()
                    .then((value) => {
                        console.log("3")
                        console.log(value)
                        fileId = value._id;
                        const wb = xlsx.readFile("./uploads/" + fileName); //讀取xlsx檔案
                        //console.log(wb.SheetNames);
                        const ws = wb.Sheets[wb.SheetNames[0]];  //讀取workbook中的其中一個sheet
                        //console.log(ws);
                        const data = xlsx.utils.sheet_to_json(ws); //用xlsx套件將sheet轉json
                        console.log(wb.Sheets)
                        console.log(data)
                        data.forEach((content) => {
                            const newData = new DiscussData({ //將每筆json存入discussData表
                                fileId: mongoose.Types.ObjectId(fileId),
                                content: content.content,
                                index: content.index,
                                time: content.time,
                                group: content.group,
                                user: content.user
                            });
                            // newData.history.push({
                            //   userId:"testUserId",

                            // });
                            newData.save() //將每筆資料（一段話）存進discuss data collection
                                .then((value) => {
                                    console.log(value)
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return res.status(500).send(err)
                                });
                        })
                        res.send({ success: "success upload file" });
                        //File.findById()
                    }).catch(value => {
                        console.log("4")
                        console.log(value)
                        res.send({ error: value })
                    });

                // UserProfile.findById(userId).then( //找到目標使用者
                //     user => {
                //         let FNId; //紀錄存到db後的file id
                //         let returnValue; //紀錄要丟回前端的檔案資料
                //         user.files.push({ //把這些資料丟進files array
                //             fileName: userFileName,
                //             coCode: coCode,
                //             codeSys: codeSys
                //         })
                //         user.save().then((value) => { //儲存剛剛丟進去的東西
                //             console.log(value)
                //             for (let i = 0; i < user.files.length; i++) { //找尋剛剛丟進去那筆檔案的file id
                //                 if (user.files[i].fileName == userFileName) {
                //                     FNId = user.files[i]._id;
                //                     returnValue = user.files[i];
                //                 }
                //             }
                //             const wb = xlsx.readFile("./uploads/" + userFileName); //讀取xlsx檔案
                //             //console.log(wb.SheetNames);
                //             const ws = wb.Sheets[wb.SheetNames[1]];  //讀取workbook中的其中一個sheet
                //             //console.log(ws);
                //             const data = xlsx.utils.sheet_to_json(ws); //用xlsx套件將sheet轉json
                //             data.forEach((item) => {
                //                 const newData = new DiscussData({ //將每筆json存入discussData表
                //                     FNId: mongoose.Types.ObjectId(FNId),
                //                     dataName: item.dataName,
                //                     history:[
                //                         {
                //                             userId: userId,
                //                             perspective: ['社會', '環保'],
                //                             purpose: ['提出疑問', '表達支持'],
                //                             version: ['1'],
                //                         }
                //                     ]
                //                 });
                //                 // newData.history.push({
                //                 //   userId:"testUserId",

                //                 // });
                //                 newData.save() //將每筆資料（一段話）存進discuss data collection
                //                     .then((value) => {
                //                         console.log(value)
                //                     })
                //                     .catch((err) => {
                //                         console.log(err);
                //                         return res.status(500).send(err)
                //                     });
                //             })
                //             res.send(returnValue);
                //         })
                //             .catch(value => {
                //                 console.log(value)
                //                 return res.send({ error: value })
                //             });
                //     }
                // ).catch((err) => {
                //     return res.status(500).send({
                //         user: err || "Some error occurred while retrieving users.",
                //     });
                // })


            }
        });
    }
});

router.get('/', async (req, res) => {
    console.log("in download excel")
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');
    //const { encodeTaskId, fileId } = req.body;
    const { encodeTaskId, fileId} = req.body;
    const discussData = await DiscussData.aggregate([
        {
            $match:
            {
                //'history.'
                "fileId": mongoose.Types.ObjectId(fileId)
                //$or: [{ "userId": mongoose.Types.ObjectId(userId) }, { "coCoder": mongoose.Types.ObjectId(userId) }]
            }
        },
        {
            "$unwind":
            {
                "path": "$history",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $match:
            {
                //'history.'
                "history.encodeTaskId": mongoose.Types.ObjectId(encodeTaskId)
                //$or: [{ "userId": mongoose.Types.ObjectId(userId) }, { "coCoder": mongoose.Types.ObjectId(userId) }]
            }
        },
        {
            $lookup:
            {
                from: 'users',
                localField: 'history.userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        }
    ]);
    let dataIdArr = []
    discussData.forEach(item => { //找出不重複的dataId
        let sId = item._id.toString();
        if (dataIdArr.indexOf(sId) == -1) {
            dataIdArr.push(sId);
        }
    })
    let firstData = discussData.filter(item => item._id.toString() == dataIdArr[0]);
    const aName = firstData[0].userDetails[0].account;
    const bName = firstData[1].userDetails[0].account;
    const aId = firstData[0].userDetails[0]._id;
    const bId = firstData[1].userDetails[0]._id;
    // console.log(dataIdArr)
    // console.log(aName, bName)
    // console.log(aId, bId)
    const headingColumnNames = [
        "Content",
        aName,
        bName,
        "final"
    ];
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++)
            .string(heading)
    });
    let rowIndex = 2;
    dataIdArr.forEach(id => {
        let column = 1;
        oneData = discussData.filter(data => data._id.toString() == id);
        console.log(oneData);
        let a = oneData.filter(one => one.userDetails[0]._id.equals(aId))[0]
        let b = oneData.filter(one => one.userDetails[0]._id.equals(bId))[0]
        ws.cell(rowIndex, column++)
            .string(a.content);
        ws.cell(rowIndex, column++)
            .string(a.history.code[0]);
        ws.cell(rowIndex, column++)
            .string(b.history.code[0]);
        ws.cell(rowIndex, column)
            .string(a.result[0].code[0]);
        rowIndex++; 
    })


    wb.write('data.xlsx', res);
});

router.delete('/', (req, res) => {
    let userId = req.body.userId; //儲存使用者id
    let fileName = req.body.fileName; //儲存檔名
    //紀錄檔案路徑
    let filePath = "/Users/garyzseng/Desktop/project/expressPlusMongo/uploads/" + fileName;
    //移除檔案
    fs.unlinkSync(filePath);
    UserProfile.findById(userId).then( //找到user資料
        user => {
            console.log(user);
            let index = -1;
            let FNId = -1;
            for (let i = 0; i < user.files.length; i++) { //找到要刪除的檔名的index同時紀錄FNId在之後刪除discussdata中的資料用的
                if (user.files[i].fileName == fileName) {
                    index = i;
                    FNId = user.files[i]._id;
                }
            }
            user.files.splice(index, 1); //移除user.files裡頭的那筆資料
            user.save().then( //儲存移除資料後的user
                value => {
                    console.log(value)
                })
                .catch(value => {
                    console.log(value)
                    return res.send({ error: value })
                });
            DiscussData.deleteMany({ FNId: FNId }).then( //移除再discussdata中要刪除的資料
                value => {
                    console.log(value);
                })
                .catch(value => {
                    console.log(value)
                    return res.send({ error: value })
                });
            res.send("deletion complete")
        })
        .catch((err) => {
            return res.status(500).send({
                user: err || "Some error occurred while retrieving users.",
            });
        })
});



module.exports = router;