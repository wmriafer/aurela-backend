const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getState, syncCollection, syncSettings } = require('../controllers/stateController');

const router = express.Router();
router.use(requireAuth);

router.get('/', getState);
router.put('/collection', syncCollection);
router.put('/settings', syncSettings);

module.exports = router;
