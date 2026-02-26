const express = require('express');
const router = express.Router();
const { getMindmapPdfs } = require('../controllers/pcmMindmapsController');
const { firebaseProtect } = require('../middleware/firebaseAuthMiddleware');

// GET /api/pcm-mindmaps/:productId - Get signed URLs for a purchased product's PDFs
// Protected by Firebase authentication
router.get('/:productId', firebaseProtect, getMindmapPdfs);

module.exports = router;
