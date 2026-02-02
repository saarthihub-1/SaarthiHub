// Mind Maps Data for JEE/CET Preparation
// Structure: Each subject has Low Weightage (₹49) and High Weightage (₹69) cards

export const subjects = [
    { id: 'physics', name: 'Physics', icon: '⚛️', color: '#3b82f6' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: '#10b981' },
    { id: 'mathematics', name: 'Mathematics', icon: '📐', color: '#f59e0b' },
];

// Mind Maps - 2 per subject (Low Weightage + High Weightage)
export const mindmaps = [
    // ===============================================
    // PHYSICS
    // ===============================================
    {
        id: 'physics-low-weightage',
        title: 'Physics - Low Weightage Chapters',
        subject: 'physics',
        weightage: 'low',
        description: 'Complete mind maps for low weightage chapters including Units & Measurements, Motion in a Straight Line, Thermal Properties of Matter, Kinetic Theory, Oscillations, Waves, Ray Optics, and Communication Systems.',
        chapters: [
            'Units & Measurements',
            'Motion in a Straight Line',
            'Thermal Properties of Matter',
            'Kinetic Theory of Gases',
            'Oscillations & Waves',
            'Ray Optics',
            'Communication Systems',
        ],
        price: 49,
        bundleId: 'physics-bundle',
        previewUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        pages: [
            'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200',
            'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=1200',
        ],
        tags: ['JEE Main', 'MHT-CET'],
    },
    {
        id: 'physics-high-weightage',
        title: 'Physics - High Weightage Chapters',
        subject: 'physics',
        weightage: 'high',
        description: 'Complete mind maps for high weightage chapters including Mechanics, Electrostatics, Current Electricity, Magnetism, EMI, Modern Physics, and Semiconductors - the most important topics for JEE & CET.',
        chapters: [
            'Laws of Motion & Friction',
            'Work, Energy & Power',
            'Rotational Motion',
            'Gravitation',
            'Electrostatics',
            'Current Electricity',
            'Magnetism & Moving Charges',
            'Electromagnetic Induction',
            'Atoms & Nuclei',
            'Semiconductors',
        ],
        price: 69,
        bundleId: 'physics-bundle',
        previewUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800',
        pages: [
            'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200',
        ],
        tags: ['JEE Main', 'JEE Advanced', 'MHT-CET'],
    },

    // ===============================================
    // CHEMISTRY
    // ===============================================
    {
        id: 'chemistry-low-weightage',
        title: 'Chemistry - Low Weightage Chapters',
        subject: 'chemistry',
        weightage: 'low',
        description: 'Complete mind maps for low weightage chapters including Environmental Chemistry, Chemistry in Everyday Life, Surface Chemistry, Biomolecules, and Polymers.',
        chapters: [
            'Environmental Chemistry',
            'Chemistry in Everyday Life',
            'Surface Chemistry',
            'Biomolecules',
            'Polymers',
            's-Block Elements',
            'Hydrogen',
        ],
        price: 49,
        bundleId: 'chemistry-bundle',
        previewUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
        pages: [
            'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200',
        ],
        tags: ['JEE Main', 'MHT-CET'],
    },
    {
        id: 'chemistry-high-weightage',
        title: 'Chemistry - High Weightage Chapters',
        subject: 'chemistry',
        weightage: 'high',
        description: 'Complete mind maps for high weightage chapters including Organic Chemistry reactions, Chemical Bonding, Thermodynamics, Equilibrium, Electrochemistry, and Coordination Compounds.',
        chapters: [
            'Chemical Bonding & Molecular Structure',
            'Thermodynamics',
            'Chemical Equilibrium',
            'Electrochemistry',
            'Chemical Kinetics',
            'General Organic Chemistry',
            'Hydrocarbons',
            'Aldehydes, Ketones & Carboxylic Acids',
            'Coordination Compounds',
            'p-Block Elements',
        ],
        price: 69,
        bundleId: 'chemistry-bundle',
        previewUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800',
        pages: [
            'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=1200',
        ],
        tags: ['JEE Main', 'JEE Advanced', 'MHT-CET'],
    },

    // ===============================================
    // MATHEMATICS
    // ===============================================
    {
        id: 'mathematics-low-weightage',
        title: 'Mathematics - Low Weightage Chapters',
        subject: 'mathematics',
        weightage: 'low',
        description: 'Complete mind maps for low weightage chapters including Mathematical Reasoning, Statistics, Linear Programming, Sets & Relations, and Trigonometric Equations.',
        chapters: [
            'Sets & Relations',
            'Mathematical Reasoning',
            'Statistics',
            'Linear Programming',
            'Trigonometric Equations',
            'Inverse Trigonometry',
            'Mathematical Induction',
        ],
        price: 49,
        bundleId: 'mathematics-bundle',
        previewUrl: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800',
        pages: [
            'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=1200',
        ],
        tags: ['JEE Main', 'MHT-CET'],
    },
    {
        id: 'mathematics-high-weightage',
        title: 'Mathematics - High Weightage Chapters',
        subject: 'mathematics',
        weightage: 'high',
        description: 'Complete mind maps for high weightage chapters including Calculus, Coordinate Geometry, Algebra, Vectors & 3D, and Probability - the backbone of JEE Math.',
        chapters: [
            'Limits & Continuity',
            'Differentiation',
            'Application of Derivatives',
            'Indefinite Integration',
            'Definite Integration',
            'Differential Equations',
            'Coordinate Geometry (Straight Lines, Circles, Conics)',
            'Complex Numbers',
            'Matrices & Determinants',
            'Probability',
            'Vectors & 3D Geometry',
        ],
        price: 69,
        bundleId: 'mathematics-bundle',
        previewUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800',
        pages: [
            'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=1200',
        ],
        tags: ['JEE Main', 'JEE Advanced', 'MHT-CET'],
    },
];

// Bundles
export const bundles = [
    {
        id: 'physics-bundle',
        name: 'Physics Complete Bundle',
        subject: 'physics',
        description: 'Both Low & High Weightage Physics mind maps at discounted price',
        includes: ['physics-low-weightage', 'physics-high-weightage'],
        originalPrice: 118, // 49 + 69
        price: 99,
        savings: 19,
    },
    {
        id: 'chemistry-bundle',
        name: 'Chemistry Complete Bundle',
        subject: 'chemistry',
        description: 'Both Low & High Weightage Chemistry mind maps at discounted price',
        includes: ['chemistry-low-weightage', 'chemistry-high-weightage'],
        originalPrice: 118, // 49 + 69
        price: 99,
        savings: 19,
    },
    {
        id: 'mathematics-bundle',
        name: 'Mathematics Complete Bundle',
        subject: 'mathematics',
        description: 'Both Low & High Weightage Mathematics mind maps at discounted price',
        includes: ['mathematics-low-weightage', 'mathematics-high-weightage'],
        originalPrice: 118, // 49 + 69
        price: 99,
        savings: 19,
    },
    {
        id: 'complete-pack',
        name: 'Complete JEE/CET Mind Map Pack',
        subject: 'all',
        description: 'All 6 mind maps (Physics + Chemistry + Mathematics) - Best Value!',
        includes: [
            'physics-low-weightage',
            'physics-high-weightage',
            'chemistry-low-weightage',
            'chemistry-high-weightage',
            'mathematics-low-weightage',
            'mathematics-high-weightage',
        ],
        originalPrice: 299,
        price: 249,
        savings: 50,
        featured: true,
    },
];

// Predictor Credits
export const predictorCredits = [
    {
        id: 'credits-1',
        name: '1 Predictor Use',
        credits: 1,
        price: 10,
        popular: false,
    },
    {
        id: 'credits-3',
        name: '3 Predictor Uses',
        credits: 3,
        price: 25,
        popular: true,
    },
    {
        id: 'credits-10',
        name: '10 Predictor Uses',
        credits: 10,
        price: 50,
        popular: false,
    },
];

// Helper functions
export const getMindmapById = (id) => mindmaps.find(m => m.id === id);
export const getBundleById = (id) => bundles.find(b => b.id === id);
export const getMindmapsBySubject = (subject) => mindmaps.filter(m => m.subject === subject);
export const getSubjectById = (id) => subjects.find(s => s.id === id);
export const getMindmapsByWeightage = (weightage) => mindmaps.filter(m => m.weightage === weightage);

// Get mindmaps grouped by subject
export const getMindmapsGroupedBySubject = () => {
    const grouped = {};
    subjects.forEach(subject => {
        grouped[subject.id] = mindmaps.filter(m => m.subject === subject.id);
    });
    return grouped;
};

// Get bundle for a subject
export const getSubjectBundle = (subjectId) => bundles.find(b => b.subject === subjectId && b.id !== 'complete-pack');
