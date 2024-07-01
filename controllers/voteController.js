const bcrypt = require('bcrypt');
const Vote = require('../models/Vote');
const Event = require('../models/Event');

exports.checkIfUserHasVoted = async (userId, eventId) => {
  try {
    const votes = await Vote.find({ event_id: eventId });
    for (const vote of votes) {
      const match = await bcrypt.compare(userId, vote.user);
      if (match) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking votes:', error);
    throw new Error('Error checking votes');
  }
};

exports.vote = async (req, res) => {
  try {
    const { eventId, option } = req.body;
    const userId = req.user.id;

    Vote.checkEventExpired(eventId)
    .then(async(isExpired) => {
      if (isExpired) {
        throw new Error('Event has expired');
      }
      const hashedUserId = await bcrypt.hash(userId, 10);
      const vote = await Vote.create({
        user: hashedUserId,
        event_id: eventId,
        option: option,
      });
      res.status(201).json({ message: 'Vote recorded', vote });
  
    });
  } catch (error) {
    if(error.message === 'Event has expired') {
      res.status(400).json({ message: error.message });
    }
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
