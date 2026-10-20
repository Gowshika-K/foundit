const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Image Upload Config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 1. Create new Lost/Found Item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { type, title, description, category, location, date, verifyQuestion, verifyAnswer } = req.body;
    const newItem = new Item({
      type, title, description, category, location, date, verifyQuestion,
      verifyAnswer: verifyAnswer.toLowerCase().trim(),
      postedBy: req.user.userId,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });
    await newItem.save();
    res.status(201).json({ message: 'Item posted successfully!', item: newItem });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Get All Items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Get Items Posted by User
router.get('/myposts', auth, async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
