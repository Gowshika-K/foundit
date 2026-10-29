const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'Lost' or 'Found'
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  phone: { type: String, default: '' }, // New field for phone/WhatsApp
  verifyQuestion: { type: String, required: true },
  verifyAnswer: { type: String, required: true },
  image: { type: String, default: '' },
  status: { type: String, default: 'Open' }, // 'Open', 'Claimed'
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
