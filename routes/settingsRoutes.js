const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Settings = require('../models/Settings');

const router = express.Router();
router.use(requireAuth);

// GET /api/settings
router.get('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ user: req.userId });
    if (!settings) settings = await Settings.create({ user: req.userId });
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings
router.put('/', async (req, res, next) => {
  try {
    const { theme, accent } = req.body;
    const data = {};
    if (theme !== undefined) data.theme = theme;
    if (accent !== undefined) data.accent = accent;

    const settings = await Settings.findOneAndUpdate(
      { user: req.userId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
