const Event = require("../models/Event");
const Vote = require("../models/Vote");
const voteController = require("./voteController");

// expects a json body with name, options, limit_date
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 * @example
 * {
 * "name": "Event Name",
 * "options": ["option1", "option2", "option3"],
 * "limit_date": "2021-09-30T00:00:00.000Z"
 * }
 */
exports.createEvent = async (req, res) => {
  try {
    const { name, options, limit_date } = req.body;

    // if (authorizedUsers.length < 5) {
    //   return res
    //     .status(400)
    //     .json({ message: "At least 5 authorized users required" });
    // }

    const event = await Event.create({
      name,
      options: options,
      limit_date,
      // authorized_users: JSON.stringify(authorizedUsers),
    });

    // authorizedUsers.forEach(user => {
    //   // send invitation email to users
    //   sendEmail(user, 'Invitation to vote', `You are invited to vote on the event: ${name}`);
    // });

    res.status(201).json(event);
  } catch (error) {
    console.log("Error while creating event", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, options, limit_date } = req.body;

    const event = await Event.findById(id);
    event.name = name;
    event.options = options;
    event.limit_date = limit_date;
    await Event.update(id, event);

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.delete(id);
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
};

exports.listEvents = async (req, res) => {
  try {
    const events = await Event.findAll({});
    const userId = req.user.id;
    const eventWithVotedStatus = await Promise.all(
      events.map(async (event) => {
        const userHasVoted = await voteController.checkIfUserHasVoted(
          userId,
          event.id
        );
        const votesCount = await Event.getEventVotesCount(event.id);
        return {
          ...event,
          voted: userHasVoted,
          votes_count: votesCount,
        };
      })
    );
    res.status(200).json(eventWithVotedStatus);
  } catch (error) {
    console.log("Error while listing events", error);
    res.status(500).json({ error: error.message });
  }
};

exports.findEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    const userId = req.user.id;
    const userHasVoted = await voteController.checkIfUserHasVoted(userId, id);
    const votes = await Vote.findByEventId(id);
    const results = await Vote.getResults(event, votes);
    event.voted = userHasVoted;
    event.votes_count = votes.length;
    event.results = results;
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
