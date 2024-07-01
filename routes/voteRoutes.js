const express = require("express");
const voteController = require("../controllers/voteController");
const middlewares = require("../middlewares/middlewares");
const router = express.Router();

router.post("/create", middlewares.authMiddleware, async (req, res) => {
  try {
    const { user_id, event_id } = req.body;
    const userHasVoted = await checkIfUserHasVoted(user_id, event_id);
    if (userHasVoted) {
      return res.status(400).json({ message: "User has already voted" });
    }
    return await voteController.vote(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
