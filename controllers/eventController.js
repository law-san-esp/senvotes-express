const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { name, options, limit_date, authorizedUsers } = req.body;

    if (authorizedUsers.length < 5) {
      return res.status(400).json({ message: 'At least 5 authorized users required' });
    }

    const event = await Event.create({
      name,
      options: JSON.stringify(options),
      limit_date,
      authorized_users: JSON.stringify(authorizedUsers),
    });

    authorizedUsers.forEach(user => {
      // send invitation email to users
      sendEmail(user, 'Invitation to vote', `You are invited to vote on the event: ${name}`);
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
