const express = require("express");
const voteController = require("../controllers/voteController");
const middlewares = require("../middlewares/middlewares");
const router = express.Router();

router.post("/create", middlewares.authMiddleware, voteController.vote);


module.exports = router;
