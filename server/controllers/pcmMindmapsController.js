const { db, isInitialized } = require('../config/firebaseAdmin');
const { generateSignedUrlsForPdfs } = require('../config/cloudinaryConfig');

/**
 * @desc    Get signed URLs for PCM Mindmaps PDFs
 * @route   GET /api/pcm-mindmaps
 * @access  Private (requires Firebase auth + purchase verification)
 */
const getPcmMindmaps = async (req, res) => {
    // Check if Firebase is initialized
    if (!isInitialized || !db) {
        return res.status(503).json({
            message: 'Service temporarily unavailable - Firebase not configured',
            error: 'SERVICE_UNAVAILABLE'
        });
    }

    const uid = req.user.uid;

    try {
        // Step 1: Check if user has purchased pcm-mindmaps
        const purchasesRef = db.collection('purchases');
        const purchaseQuery = purchasesRef
            .where('userId', '==', uid)
            .where('productId', '==', 'pcm-mindmaps');

        const purchaseSnapshot = await purchaseQuery.get();

        if (purchaseSnapshot.empty) {
            return res.status(403).json({
                message: 'Purchase required',
                error: 'NOT_PURCHASED',
                requiresPurchase: true
            });
        }

        // Optional: Check if paid field exists and is true
        const purchaseDoc = purchaseSnapshot.docs[0].data();
        if (purchaseDoc.paid === false) {
            return res.status(403).json({
                message: 'Payment pending',
                error: 'PAYMENT_PENDING',
                requiresPurchase: true
            });
        }

        // Step 2: Get pdfIds from products/pcm-mindmaps document
        const productRef = db.collection('products').doc('pcm-mindmaps');
        const productSnapshot = await productRef.get();

        if (!productSnapshot.exists) {
            console.error('Product document products/pcm-mindmaps not found');
            return res.status(500).json({
                message: 'Product configuration not found',
                error: 'PRODUCT_NOT_FOUND'
            });
        }

        const productData = productSnapshot.data();
        const pdfIds = productData.pdfIds;

        if (!pdfIds || !Array.isArray(pdfIds) || pdfIds.length === 0) {
            console.error('No pdfIds array in products/pcm-mindmaps document');
            return res.status(500).json({
                message: 'No PDFs configured for this product',
                error: 'NO_PDFS_CONFIGURED'
            });
        }

        // Step 3: Generate signed URLs for each PDF (5-minute expiry)
        const signedPdfs = generateSignedUrlsForPdfs(pdfIds, {
            expiresInSeconds: 300 // 5 minutes
        });

        // Step 4: Return the signed URLs
        res.json({
            success: true,
            pdfs: signedPdfs,
            expiresIn: 300 // Let frontend know URLs expire in 5 minutes
        });

    } catch (error) {
        console.error('Error fetching PCM mindmaps:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    getPcmMindmaps
};
