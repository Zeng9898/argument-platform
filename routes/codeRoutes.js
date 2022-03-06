const express = require("express")
const router = express.Router()
const CodeSys = require("../models/codeSys.model")
const EncodeTask = require("../models/encodeTask.model")
const File = require("../models/file.model")
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

router.get('/allEncodeTask/:userId', async (req, res) => {
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
            setTimeout(function(){
                res.send(EncodeTask);
            },1000);
        }
    ).catch((err) => {
        return res.status(500).send({
            encodeTask: err || "Some error occurred while retrieving encodeTasks.",
        });
    })
});



module.exports = router;