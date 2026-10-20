const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const handleClaim = async (req, res) => {
  try {
    const itemId = req.params.itemId || req.body.itemId;
    const rawAnswer = req.body.answer || req.body.answerGiven || '';

    const item = await Item.findById(itemId).populate('postedBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const givenClean = rawAnswer.toString().toLowerCase().trim();
    const expectedClean = (item.verifyAnswer || '').toString().toLowerCase().trim();

    console.log("?? Typed Answer:", givenClean, "| ? Expected DB Answer:", expectedClean);

    const isCorrect = (givenClean === expectedClean) || (givenClean.length > 0 && (expectedClean.includes(givenClean) || givenClean.includes(expectedClean)));

    const newClaim = new Claim({
      item: item._id,
      claimer: req.user.userId,
      answerGiven: rawAnswer,
      result: isCorrect ? 'correct' : 'wrong'
    });
    await newClaim.save();

    if (isCorrect) {
      item.status = 'Claimed';
      await item.save();
      return res.status(200).json({
        success: true,
        message: 'Answer is correct! You have successfully claimed this item.',
        contact: {
          name: item.postedBy ? item.postedBy.name : 'Finder',
          email: item.postedBy ? item.postedBy.email : 'Not available'
        }
      });
    } else {
      return res.status(400).json({ success: false, message: 'Incorrect answer. Try again!' });
    }
  } catch (err) {
    console.error("CLAIM ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

router.post('/', auth, handleClaim);
router.post('/:itemId', auth, handleClaim);

module.exports = router;
