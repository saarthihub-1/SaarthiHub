const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

/**
 * Generate a signed URL for a private Cloudinary resource
 * @param {string} publicId - The public ID of the resource in Cloudinary
 * @param {object} options - Additional options
 * @param {number} options.expiresInSeconds - URL expiry time in seconds (default: 300 = 5 minutes)
 * @returns {string} Signed URL
 */
const generateSignedUrl = (publicId, options = {}) => {
    // PDFs are uploaded as image type with upload (public) access
    // Convert to jpg pages for browser rendering
    return cloudinary.url(publicId, {
        resource_type: 'image',
        type: 'upload',
        format: 'jpg',         // Convert PDF to JPG for browser display
        quality: 'auto:best',  // Best quality
        flags: 'attachment:false',
    });
};

/**
 * Generate signed URLs for multiple private PDFs
 * @param {string[]} pdfIds - Array of Cloudinary public IDs
 * @param {object} options - Additional options
 * @returns {Array<{pdfId: string, url: string}>} Array of objects with pdfId and signed URL
 */
const generateSignedUrlsForPdfs = (pdfIds, options = {}) => {
    return pdfIds.map(pdfId => ({
        pdfId,
        url: generateSignedUrl(pdfId, options)
    }));
};

module.exports = {
    cloudinary,
    generateSignedUrl,
    generateSignedUrlsForPdfs
};
