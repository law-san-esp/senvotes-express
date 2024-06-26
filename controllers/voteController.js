const Vote = require('../models/Vote');
const Event = require('../models/Event');

exports.vote = async (req, res) => {
  try {
    const { eventId, option } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (new Date(event.limit_date) < new Date()) {
      return res.status(400).json({ message: 'Voting period has ended' });
    }

    const vote = await Vote.create({
      user_id: userId,
      event_id: eventId,
      option,
    });

    res.status(201).json({ message: 'Vote recorded', vote });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
