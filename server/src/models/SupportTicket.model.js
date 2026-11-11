const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, enum: ['Bug Report', 'Feature Request', 'Account & Privacy', 'General Help'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  description: { type: String, required: true, maxlength: 1500 },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  staffResponse: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
