const { auth, isInitialized } = require('../config/firebaseAdmin');

/**
 * Firebase Authentication Middleware
 * Verifies Firebase ID tokens from the Authorization header
 * 
 * Expected header format: Authorization: Bearer <Firebase ID Token>
 */
const firebaseProtect = async (req, res, next) => {
    // Check if Firebase Admin is initialized
    if (!isInitialized || !auth) {
        console.error('Firebase Admin SDK not initialized - cannot verify tokens');
        return res.status(503).json({
            message: 'Service temporarily unavailable - Firebase not configured',
            error: 'SERVICE_UNAVAILABLE'
        });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'No token provided',
            error: 'UNAUTHORIZED'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the Firebase ID token
        const decodedToken = await auth.verifyIdToken(token);

        // Attach user info to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified
        };

        next();
    } catch (error) {
        console.error('Firebase token verification failed:', error.message);

        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({
                message: 'Token expired',
                error: 'TOKEN_EXPIRED'
            });
        }

        return res.status(401).json({
            message: 'Invalid token',
            error: 'INVALID_TOKEN'
        });
    }
};

module.exports = { firebaseProtect };
