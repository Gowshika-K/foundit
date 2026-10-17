const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  claimer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answerGiven: { type: String, required: true },
  result: { type: String, enum: ['correct', 'wrong'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);