const Reminder = require('../models/Reminder.model');

const getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ reminders });
  } catch (error) {
    next(error);
  }
};

const createReminder = async (req, res, next) => {
  try {
    const { title, type, timeOfDay, daysOfWeek } = req.body;

    const reminder = new Reminder({
      userId: req.user.id,
      title,
      type,
      timeOfDay,
      daysOfWeek: daysOfWeek || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true
    });

    await reminder.save();
    res.status(201).json({ reminder });
  } catch (error) {
    next(error);
  }
};

const toggleReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found or unauthorized' });
    }

    if (req.body.enabled !== undefined) {
      reminder.enabled = req.body.enabled;
    } else {
      reminder.enabled = !reminder.enabled;
    }

    await reminder.save();
    res.status(200).json({ reminder });
  } catch (error) {
    next(error);
  }
};

const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found or unauthorized' });
    }
    res.status(200).json({ deletedId: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReminders,
  createReminder,
  toggleReminder,
  deleteReminder
};
