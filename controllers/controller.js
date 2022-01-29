const db = require("../models");
const mongoose = require('mongoose');
const DiscussData = require("../models/discussData.model");
const { ObjectId } = require("bson");

exports.tagData = (req, res) => { //標註用api
  // Validate request
  if (!req.body._id || !req.body.history) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  console.log(req.body);
  DiscussData.findById(req.body._id)
    .then((data) => {
      console.log("data", data);
      const {userId, perspective, purpose, version} = req.body.history;
      data.FNId = ObjectId(data.FNId);
      userId = ObjectId(userId);
      data.history.push({ //把這些資料丟進files array
        userId: userId,
        perspective: perspective,
        purpose: purpose,
        version: version
      })
      data.save()
        .then((value) => {
          console.log(value)
          res.send({ success: "success save tag" })
        })
        .catch(value => {
          console.log(value)
          res.send({ error: value })
        });
    })
    .catch((err) => {
      res.status(500).send({
        DiscussData: err || "Some error occurred while retrieving discuss data.",
      });
    })
  // const pickData = new PickData({
  //   userId: mongoose.Types.ObjectId(req.body.userId),
  //   DDId: req.body.DDId,
  //   dataName: req.body.dataName,
  //   perspective: req.body.perspective,
  //   purpose: req.body.purpose
  // });

  // Save pickData in the database
  // pickData
  //   .save(pickData)
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while creating the Tutorial."
  //     });
  //   });
};

exports.getFileData = (req, res) => {
  const FNId = req.body.FNId;
  DiscussData.find({ FNId: FNId })
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        DiscussData: err || "Some error occurred while retrieving discuss data.",
      });
    })
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {

};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};