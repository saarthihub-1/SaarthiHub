const { db, isInitialized } = require('../config/firebaseAdmin');
const { generateSignedUrlsForPdfs } = require('../config/cloudinaryConfig');

/**
 * @desc    Get signed URLs for a purchased product's PDFs
 * @route   GET /api/pcm-mindmaps/:productId
 * @access  Private (requires Firebase auth + purchase verification)
 */
const getMindmapPdfs = async (req, res) => {
    // Check if Firebase is initialized
    if (!isInitialized || !db) {
        return res.status(503).json({
            message: 'Service temporarily unavailable - Firebase not configured',
            error: 'SERVICE_UNAVAILABLE'
        });
    }

    const uid = req.user.uid;
    const productId = req.params.productId;

    if (!productId) {
        return res.status(400).json({
            message: 'Product ID is required',
            error: 'MISSING_PRODUCT_ID'
        });
    }

    try {
        // Step 1: Check if user has purchased this product
        const purchasesRef = db.collection('purchases');
        const purchaseQuery = purchasesRef
            .where('userId', '==', uid)
            .where('productId', '==', productId);

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

        // Step 2: Get pdfIds from products/{productId} document
        const productRef = db.collection('products').doc(productId);
        const productSnapshot = await productRef.get();

        if (!productSnapshot.exists) {
            console.error(`Product document products/${productId} not found`);
            return res.status(404).json({
                message: 'Product not found',
                error: 'PRODUCT_NOT_FOUND'
            });
        }

        const productData = productSnapshot.data();
        const pdfIds = productData.pdfIds;

        if (!pdfIds || !Array.isArray(pdfIds) || pdfIds.length === 0) {
            // No PDFs configured yet — return empty array so frontend can show placeholder
            return res.json({
                success: true,
                pdfs: [],
                product: {
                    id: productId,
                    title: productData.title,
                    chapters: productData.chapters || [],
                },
                expiresIn: 0
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
            product: {
                id: productId,
                title: productData.title,
                chapters: productData.chapters || [],
            },
            expiresIn: 300 // Let frontend know URLs expire in 5 minutes
        });

    } catch (error) {
        console.error(`Error fetching mindmap PDFs for ${productId}:`, error);
        res.status(500).json({
            message: 'Internal server error',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = {
    getMindmapPdfs
};
