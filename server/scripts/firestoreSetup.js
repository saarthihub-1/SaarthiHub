/**
 * Firestore Setup Script
 * Seeds the products collection with all SaarthiHub products.
 * 
 * Usage: node scripts/firestoreSetup.js
 * 
 * Prerequisites:
 * - FIREBASE_SERVICE_ACCOUNT env var must be set, OR
 * - serviceAccountKey.json must exist in server/ directory
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Initialize Firebase Admin
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');
    if (fs.existsSync(keyPath)) {
        serviceAccount = require(keyPath);
    } else {
        console.error('❌ No Firebase credentials found.');
        console.error('Set FIREBASE_SERVICE_ACCOUNT env var or place serviceAccountKey.json in server/');
        process.exit(1);
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ============================================================
// Product Catalog
// ============================================================

const products = [
    // Mindmaps - Physics
    {
        id: 'physics-low-weightage',
        title: 'Physics - Low Weightage Chapters',
        type: 'mindmap',
        subject: 'physics',
        price: 49,
        description: 'Complete mind maps for low weightage chapters including Units & Measurements, KTG, Thermal Properties, etc.',
        chapters: ['Units & Measurements', 'Motion in a Straight Line', 'Thermal Properties of Matter', 'Kinetic Theory of Gases', 'Oscillations & Waves', 'Ray Optics', 'Communication Systems'],
        pdfIds: [], // Add Cloudinary public IDs when ready
        active: true,
    },
    {
        id: 'physics-high-weightage',
        title: 'Physics - High Weightage Chapters',
        type: 'mindmap',
        subject: 'physics',
        price: 69,
        description: 'Complete mind maps for high weightage chapters including Mechanics, Electrostatics, Current Electricity, Magnetism, and Modern Physics.',
        chapters: ['Laws of Motion & Friction', 'Work, Energy & Power', 'Rotational Motion', 'Gravitation', 'Electrostatics', 'Current Electricity', 'Magnetism & Moving Charges', 'Electromagnetic Induction', 'Atoms & Nuclei', 'Semiconductors'],
        pdfIds: [],
        active: true,
    },

    // Mindmaps - Chemistry
    {
        id: 'chemistry-low-weightage',
        title: 'Chemistry - Low Weightage Chapters',
        type: 'mindmap',
        subject: 'chemistry',
        price: 49,
        description: 'Complete mind maps for low weightage chapters including Environmental Chemistry, Surface Chemistry, Biomolecules, and Polymers.',
        chapters: ['Environmental Chemistry', 'Chemistry in Everyday Life', 'Surface Chemistry', 'Biomolecules', 'Polymers', 's-Block Elements', 'Hydrogen'],
        pdfIds: [],
        active: true,
    },
    {
        id: 'chemistry-high-weightage',
        title: 'Chemistry - High Weightage Chapters',
        type: 'mindmap',
        subject: 'chemistry',
        price: 69,
        description: 'Complete mind maps for high weightage chapters including Organic Chemistry, Chemical Bonding, Thermodynamics, and Electrochemistry.',
        chapters: ['Chemical Bonding & Molecular Structure', 'Thermodynamics', 'Chemical Equilibrium', 'Electrochemistry', 'Chemical Kinetics', 'General Organic Chemistry', 'Hydrocarbons', 'Aldehydes, Ketones & Carboxylic Acids', 'Coordination Compounds', 'p-Block Elements'],
        pdfIds: [],
        active: true,
    },

    // Mindmaps - Mathematics
    {
        id: 'mathematics-low-weightage',
        title: 'Mathematics - Low Weightage Chapters',
        type: 'mindmap',
        subject: 'mathematics',
        price: 49,
        description: 'Complete mind maps for low weightage chapters including Mathematical Reasoning, Statistics, Linear Programming, and Trigonometry.',
        chapters: ['Sets & Relations', 'Mathematical Reasoning', 'Statistics', 'Linear Programming', 'Trigonometric Equations', 'Inverse Trigonometry', 'Mathematical Induction'],
        pdfIds: [],
        active: true,
    },
    {
        id: 'mathematics-high-weightage',
        title: 'Mathematics - High Weightage Chapters',
        type: 'mindmap',
        subject: 'mathematics',
        price: 69,
        description: 'Complete mind maps for high weightage chapters including Calculus, Coordinate Geometry, Algebra, Vectors & 3D, and Probability.',
        chapters: ['Limits & Continuity', 'Differentiation', 'Application of Derivatives', 'Indefinite Integration', 'Definite Integration', 'Differential Equations', 'Coordinate Geometry', 'Complex Numbers', 'Matrices & Determinants', 'Probability', 'Vectors & 3D Geometry'],
        pdfIds: [],
        active: true,
    },

    // Bundles
    {
        id: 'physics-bundle',
        title: 'Physics Complete Bundle',
        type: 'bundle',
        subject: 'physics',
        price: 99,
        description: 'Both Low & High Weightage Physics mind maps at discounted price.',
        includes: ['physics-low-weightage', 'physics-high-weightage'],
        active: true,
    },
    {
        id: 'chemistry-bundle',
        title: 'Chemistry Complete Bundle',
        type: 'bundle',
        subject: 'chemistry',
        price: 99,
        description: 'Both Low & High Weightage Chemistry mind maps at discounted price.',
        includes: ['chemistry-low-weightage', 'chemistry-high-weightage'],
        active: true,
    },
    {
        id: 'mathematics-bundle',
        title: 'Mathematics Complete Bundle',
        type: 'bundle',
        subject: 'mathematics',
        price: 99,
        description: 'Both Low & High Weightage Mathematics mind maps at discounted price.',
        includes: ['mathematics-low-weightage', 'mathematics-high-weightage'],
        active: true,
    },
    {
        id: 'complete-pack',
        title: 'Complete JEE/CET Mind Map Pack',
        type: 'bundle',
        subject: 'all',
        price: 249,
        description: 'All 6 mind maps (Physics + Chemistry + Mathematics) - Best Value!',
        includes: [
            'physics-low-weightage', 'physics-high-weightage',
            'chemistry-low-weightage', 'chemistry-high-weightage',
            'mathematics-low-weightage', 'mathematics-high-weightage',
        ],
        active: true,
    },

    // Credits
    {
        id: 'credits-1',
        title: '1 Predictor Use',
        type: 'credits',
        price: 10,
        credits: 1,
        description: 'Get 1 additional use of the Percentile Predictor.',
        active: true,
    },
    {
        id: 'credits-3',
        title: '3 Predictor Uses',
        type: 'credits',
        price: 25,
        credits: 3,
        description: 'Get 3 additional uses of the Percentile Predictor.',
        active: true,
    },
    {
        id: 'credits-10',
        title: '10 Predictor Uses',
        type: 'credits',
        price: 50,
        credits: 10,
        description: 'Get 10 additional uses of the Percentile Predictor.',
        active: true,
    },
];

// ============================================================
// Seed Firestore
// ============================================================

async function seedProducts() {
    console.log('🚀 Starting Firestore setup...\n');

    const batch = db.batch();
    let count = 0;

    for (const product of products) {
        const docRef = db.collection('products').doc(product.id);
        batch.set(docRef, {
            ...product,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true }); // merge: true so we don't overwrite pdfIds if already set
        count++;
        console.log(`  📄 ${product.type.padEnd(7)} | ${product.id}`);
    }

    await batch.commit();
    console.log(`\n✅ Seeded ${count} products to Firestore`);
}

async function main() {
    try {
        await seedProducts();
        console.log('\n🎉 Firestore setup complete!');
    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
    }
    process.exit(0);
}

main();
