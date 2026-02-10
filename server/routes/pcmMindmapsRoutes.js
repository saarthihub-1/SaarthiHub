const express = require('express');
const router = express.Router();
const { getPcmMindmaps } = require('../controllers/pcmMindmapsController');
const { firebaseProtect } = require('../middleware/firebaseAuthMiddleware');

// GET /api/pcm-mindmaps - Get signed URLs for purchased PCM mindmaps PDFs
// Protected by Firebase authentication
router.get('/', firebaseProtect, getPcmMindmaps);

module.exports = router;
