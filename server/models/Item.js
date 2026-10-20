const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Wallet', 'Phone', 'ID Card', 'Keys', 'Bag', 'Books', 'Electronics', 'Other'] 
  },
  location: { 
    type: String, 
    required: true, 
    enum: ['Library', 'Canteen', 'Hostel', 'Bus Stop', 'Ground', 'Classroom', 'Admin Block', 'Other'] 
  },
  date: { type: Date, required: true },
  image: { type: String, default: '' },
  verifyQuestion: { type: String, required: true },
  verifyAnswer: { type: String, required: true, trim: true, lowercase: true },
  status: { type: String, enum: ['Open', 'Claimed', 'Returned'], default: 'Open' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);