const express = require('express');
const router = express.Router();
const multer = require('multer');
const Item = require('../models/Item');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');
const { scoreMatch } = require('../utils/matcher');

// Configure Multer Storage for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  }
});

// 1. Post an Item (Student or Admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { type, title, description, category, location, date, timeFound, contactPhone } = req.body;
    const newItem = new Item({
      type,
      title,
      description,
      category,
      location,
      date,
      timeFound: timeFound || '12:00',
      contactPhone: contactPhone || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
      status: 'Open',
      postedBy: req.user.id
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error posting item' });
  }
});

// 2. Admin Analytics Stats
router.get('/admin/stats', auth, adminOnly, async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const lostCount = await Item.countDocuments({ type: 'lost', status: 'Open' });
    const foundCount = await Item.countDocuments({ type: 'found', status: 'Open' });
    const totalUsers = await User.countDocuments();
    res.json({ totalItems, lostCount, foundCount, totalUsers });
  } catch (err) {
    res.status(500).json({ message: 'Error loading admin stats' });
  }
});

// 3. Get Items (Hides returned/found items unless Admin showAll=true is passed!)
router.get('/', async (req, res) => {
  try {
    const { type, category, search, showAll } = req.query;
    let query = {};

    // If regular public user, ONLY show active 'Open' items!
    if (showAll !== 'true') {
      query.status = 'Open';
    }

    if (type) query.type = type;
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query).populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// 4. Admin Responsibility: Mark Item as Returned / Resolved (Takes it off the public feed!)
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id, 
      { status: status || 'Returned' }, 
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: `Item marked as ${item.status}`, item });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

// 5. Smart Matches for an Item (Top 3)
router.get('/:id/matches', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const oppositeType = item.type === 'lost' ? 'found' : 'lost';
    const candidates = await Item.find({ type: oppositeType, status: 'Open', _id: { $ne: item._id } });

    const scored = candidates.map(candidate => ({
      item: candidate,
      score: scoreMatch(item, candidate)
    }))
    .filter(match => match.score > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

    res.json(scored);
  } catch (err) {
    res.status(500).json({ message: 'Error finding matches' });
  }
});

// 6. Get Single Item Details
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving item' });
  }
});

// 7. Delete Item (Admin only or post owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You cannot delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item' });
  }
});

module.exports = router;