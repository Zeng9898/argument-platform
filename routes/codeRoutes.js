const express = require("express")
const router = express.Router()
const CodeSys = require("../models/codeSys.model")
const EncodeTask = require("../models/encodeTask.model")
const File = require("../models/file.model")
const DiscussData = require("../models/discussData.model")
const mongoose = require('mongoose');

const controller = require("../controllers/controller")

router.post('/codeSystem', (req, res) => {
    const { userId, codeName, purpose, code, source } = req.body;
    const newCodeSys = new CodeSys({
        userId: userId,
        codeName: codeName,
        purpose: purpose,
        code: code,
        source: source
    });
    newCodeSys.save()
        .then((value) => {
            console.log(value)
            res.send({ success: "create code system successfully" })
            //File.findById()
        }).catch(value => {
            console.log(value)
            res.send({ error: value })
        });
})

router.post('/encodeTask', (req, res) => {
    const { userId, fileId, startTime, endTime, status, creator } = req.body;
    const coCode = Math.floor(Math.random() * 100000);
    const newEncodeTask = new EncodeTask({
        userId: userId,
        fileId: fileId,
        startTime: startTime,
        endTime: endTime,
        status: status,
        coCode: coCode,
        creator: creator
    });
    newEncodeTask.save()
        .then((value) => {
            console.log(value)
            res.send({ success: "create encode task successfully" })
            //File.findById()
        }).catch(value => {
            console.log(value)
            res.send({ error: value })
        });
})

router.post('/tag', (req, res) => {
    console.log("1")
    const { dataId, userId, encodeTaskId, code } = req.body;
    const record = {
        userId: mongoose.Types.ObjectId(userId),
        encodeTaskId: mongoose.Types.ObjectId(encodeTaskId),
        code: code
    }
    DiscussData.findById(mongoose.Types.ObjectId(dataId)).then(
        data => {
            data.fileId = mongoose.Types.ObjectId(data.fileId)
            console.log("2")
            console.log(record)
            data.history.push(record);
            console.log("3")
            data.save().then(
                data => {
                    res.send(data)
                }
            ).catch((err) => {
                return res.status(500).send({
                    data: err || "Some error occurred while tagging data.",
                });
            })
        }
    ).catch((err) => {
        return res.status(500).send({
            DiscussData: err || "Some error occurred while retrieving DiscussData.",
        });
    })

})

router.get('/allEncodeTask/:userId', (req, res) => {
    const userId = req.params.userId
    EncodeTask.find({ userId: userId }).then(
        EncodeTask => {
            EncodeTask.forEach(task => {
                File.findById(task.fileId).then(
                    file => {
                        task.status = task.status + file.fileName;
                        console.log(task);
                    }
                ).catch((err) => {
                    return res.status(500).send({
                        File: err || "Some error occurred while retrieving files.",
                    });
                })
            })
            setTimeout(function () {
                res.send(EncodeTask);
            }, 1000);
        }
    ).catch((err) => {
        return res.status(500).send({
            encodeTask: err || "Some error occurred while retrieving encodeTasks.",
        });
    })
});



module.exports = router;