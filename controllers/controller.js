const db = require("../models");
const PickData = db.pickDatas;
const mongoose = require('mongoose');

exports.create = (req, res) => { //標註用api
  // Validate request
  if (!req.body.dataName) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  console.log(req.body);
  // Create a Tutorial
  const pickData = new PickData({
    userId: mongoose.Types.ObjectId(req.body.userId),
    DDId: req.body.DDId,
    dataName: req.body.dataName,
    perspective: req.body.perspective,
    purpose: req.body.purpose
  });

  // Save pickData in the database
  pickData
    .save(pickData)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
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