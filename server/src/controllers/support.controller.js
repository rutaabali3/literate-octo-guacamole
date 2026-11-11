const SupportTicket = require('../models/SupportTicket.model');

const createTicket = async (req, res, next) => {
  try {
    const { subject, category, priority, description } = req.body;

    if (!subject || !category || !description) {
      return res.status(400).json({ message: 'Subject, category, and description are required' });
    }

    const ticket = new SupportTicket({
      userId: req.user.id,
      subject,
      category,
      priority: priority || 'Medium',
      description,
      status: 'Open'
    });

    await ticket.save();
    res.status(201).json({ ticket });
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ tickets });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets
};
