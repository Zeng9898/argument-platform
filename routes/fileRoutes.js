const express = require("express")
const router = express.Router()
const xlsx = require('xlsx');
const DiscussData = require("../models/discussData.model")
const UserProfile = require("../models/userProfile.model")
const fs = require("fs");



router.post('/', (req, res) => {
    const { userId, userFileName, codeSys, coCode } = req.body;
    console.log(req.body)
    if (req.files) {
        console.log(req.files);
        var file = req.files.file;
        file.mv('./uploads/' + userFileName, function (err) { //把檔案移動到/uploads
            if (err) {
                res.send(err);
            } else {
                UserProfile.findById(userId).then(
                    user => {
                        let FNId;
                        let returnValue;
                        user.files.push({
                            fileName: userFileName,
                            coCode: coCode,
                            codeSys: codeSys
                        })
                        user.save().then((value) => {
                            console.log(value)
                            for (let i = 0; i < user.files.length; i++) {
                                if (user.files[i].fileName == userFileName) {
                                    FNId = user.files[i]._id;
                                    returnValue = user.files[i];
                                }
                            }
                            const wb = xlsx.readFile("./uploads/" + userFileName); //讀取xlsx檔案
                            console.log(wb.SheetNames);
                            const ws = wb.Sheets[wb.SheetNames[1]];  //讀取workbook中的其中一個sheet
                            //console.log(ws);
                            const data = xlsx.utils.sheet_to_json(ws); //用xlsx套件將sheet轉json
                            data.forEach((item) => {
                                const newData = new DiscussData({ //將每筆json存入discussData表
                                    FNId: FNId,
                                    dataName: item.dataName
                                });
                                // newData.history.push({
                                //   userId:"testUserId",

                                // });
                                newData.save()
                                    .then((value) => {
                                        console.log(value)
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        return res.status(500).send(err)
                                    });
                            })
                            res.send(returnValue);
                        })
                            .catch(value => {
                                console.log(value)
                                return res.send({ error: value })
                            });
                    }
                ).catch((err) => {
                    return res.status(500).send({
                        user: err || "Some error occurred while retrieving users.",
                    });
                })


            }
        });
    }
});


router.delete('/', (req, res) => {
    let userId = req.body.userId;
    let fileName = req.body.fileName;
    let filePath = "/Users/garyzseng/Desktop/project/expressPlusMongo/uploads/" + fileName;
    fs.unlinkSync(filePath);
    UserProfile.findById(userId).then(
        user => {
            console.log(user);
            let index = -1;
            let FNId = -1;
            for (let i = 0; i < user.files.length; i++) {
                if (user.files[i].fileName == fileName) {
                    index = i;
                    FNId = user.files[i]._id;
                }
            }
            user.files.splice(index, 1);
            user.save().then(
                value => {
                    console.log(value)
                })
                .catch(value => {
                    console.log(value)
                    return res.send({ error: value })
                });
            DiscussData.deleteMany({ FNId: FNId }).then(
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