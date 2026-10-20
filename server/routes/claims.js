const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

router.post('/:itemId', auth, async (req, res) => {
  try {
    const { answerGiven } = req.body;
    const item = await Item.findById(req.params.itemId);

    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.postedBy.toString() === req.user.userId) return res.status(400).json({ message: 'Cannot claim your own post' });
    if (item.status !== 'Open') return res.status(400).json({ message: 'Item is already claimed or returned' });

    const isCorrect = answerGiven.toLowerCase().trim() === item.verifyAnswer;
    const newClaim = new Claim({
      item: item._id,
      claimer: req.user.userId,
      answerGiven,
      result: isCorrect ? 'correct' : 'wrong'
    });
    await newClaim.save();

    if (isCorrect) {
      item.status = 'Claimed';
      await item.save();
      return res.status(200).json({ success: true, message: 'Answer is correct! You have successfully claimed this item.' });
    } else {
      return res.status(400).json({ success: false, message: 'Incorrect answer. Please try again.' });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
