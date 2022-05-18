const mongoose = require('mongoose');
const CodeSys = require("../models/codeSys.model")

const createCodeSystem = (req, res) => {
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
}

const saveCodeSystem = (req, res) => {
    const { userId, codeSysId } = req.body;
    CodeSys.findById(mongoose.Types.ObjectId(codeSysId))
        .then(codeSys => {
            codeSys.favorite.push(userId)
            codeSys.save()
                .then(result => {
                    console.log(result);
                    return res.status(201).json({
                        status: true,
                        message: 'add favorite code system successfully!'
                    })
                })
                .catch(err => {
                    console.log(err)
                    return res.status(404).json({
                        status: false,
                        message: `err occur when adding favorite code system ${err}`
                    })
                })
        })
        .catch(err => {
            console.log(err)
            return res.status(404).json({
                status: false,
                message: `err occur when finding the code system ${err}`
            })
        })
}

const unSaveCodeSystem = (req, res) => {
    
}

module.exports = { createCodeSystem, saveCodeSystem, unSaveCodeSystem}