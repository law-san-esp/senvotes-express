const bcrypt = require("bcrypt");
const Vote = require("../models/Vote");
const Event = require("../models/Event");

exports.checkIfUserHasVoted = async (userId, eventId) => {
  try {
    const votes = await Vote.findByEventId(eventId);
    for (const vote of votes) {
      const match = await bcrypt.compare(userId, vote.user);
      if (match) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking votes:", error);
    throw new Error("Error checking votes");
  }
};

exports.vote = async (req, res) => {
  try {
    const { event_id, option } = req.body;
    const eventId = event_id;
    const userId = req.user.id;

    if (!eventId || !option) {
      return res
        .status(400)
        .json({ message: "Event ID and option are required" });
    }
    //if eventId is not uuid
    if (eventId.length !== 36) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);

    const userHasVoted = await this.checkIfUserHasVoted(userId, eventId);
    if (userHasVoted) {
      return res.status(400).json({ message: "User has already voted" });
    }

    //check event limit_date to see if event is expired
    if (new Date(event.limit_date) < new Date()) {
      return res.status(400).json({ message: "Event has expired" });
    }

    const hashedUserId = await bcrypt.hash(userId, 10);
    const vote = await Vote.create(hashedUserId, eventId, option);
    res.status(201).json({ message: "Vote recorded", vote });
  } catch (error) {
    if (error.message === "Event not found") {
      res.status(404).json({ message: error.message });
    }
    if (error.message === "Event has expired") {
      res.status(400).json({ message: error.message });
    }
    console.log("Error while voting", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.listVotes = async (req, res) => {
  try {
    const votes = await Vote.findAll();
    res.status(200).json(votes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

