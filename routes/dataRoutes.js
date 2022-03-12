const controller = require("../controllers/controller.js");
const DiscussData = require("../models/discussData.model")
const UserProfile = require("../models/userProfile.model")
const express = require("express")
const router = express.Router()

router.get('/userData', async (req, res) => {
  const { userId, fileId, encodeTaskId } = req.body;
  DiscussData.find({ fileId: fileId }).then(
    data => {
      data.forEach(item => {
        item.history.filter(record => record.userId == userId && record.encodeTaskId == encodeTaskId);
        console.log(item.history);
      })
      console.log(data)
    }
  )
})
// Create a new Tutorial
// router.post("/tagData", controller.tagData);
// router.get("/getFileData", controller.getFileData);

// router.get("/allContent", controller.allContent);
// router.get("/test", (req, res) => {
//     DisscussData.find()
//     .then((data) => {
//       console.log(data);
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         restaurant: err.restaurant || "Some error occurred while retrieving restaurants.",
//       });
//     })
// });
// // Retrieve all Tutorials
// router.get("/", tutorials.findAll);

// // Retrieve all published Tutorials
// router.get("/published", tutorials.findAllPublished);

// // Retrieve a single Tutorial with id
// router.get("/:id", tutorials.findOne);

// // Update a Tutorial with id
// router.put("/:id", tutorials.update);

// // Delete a Tutorial with id
// router.delete("/:id", tutorials.delete);

// // Create a new Tutorial
// router.delete("/", tutorials.deleteAll);

module.exports = router
