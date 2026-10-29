const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { type, title, description, category, location, date, phone, verifyQuestion, question, verifyAnswer } = req.body;
    const newItem = new Item({
      type,
      title,
      description,
      category,
      location,
      date,
      phone: phone || '',
      verifyQuestion: verifyQuestion || question || '',
      verifyAnswer: (verifyAnswer || '').toLowerCase().trim(),
      postedBy: req.user.userId,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });
    await newItem.save();
    res.status(201).json({ message: 'Item posted successfully!', item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    const filter = {};

    if (type && type !== 'All') {
      filter.type = new RegExp(`^${type}$`, 'i');
    }
    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { location: regex },
        { category: regex }
      ];
    }

    const items = await Item.find(filter).populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getMyPosts = async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
router.get('/myposts', auth, getMyPosts);
router.get('/my-posts', auth, getMyPosts);

router.get('/:id/matches', async (req, res) => {
  try {
    const currentItem = await Item.findById(req.params.id);
    if (!currentItem) return res.status(404).json({ message: 'Item not found' });

    const oppositeType = currentItem.type === 'Lost' ? 'Found' : 'Lost';
    const candidates = await Item.find({ _id: { $ne: currentItem._id }, type: oppositeType, status: 'Open' });

    const scored = candidates.map(cand => {
      let score = 0;
      if (cand.category && currentItem.category && cand.category.toLowerCase() === currentItem.category.toLowerCase()) score += 40;
      if (cand.location && currentItem.location && cand.location.toLowerCase().includes(currentItem.location.toLowerCase())) score += 30;
      if (cand.title && currentItem.title && (cand.title.toLowerCase().includes(currentItem.title.toLowerCase()) || currentItem.title.toLowerCase().includes(cand.title.toLowerCase()))) score += 30;
      return { ...cand.toObject(), matchScore: score };
    }).filter(m => m.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

    res.json(scored);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
