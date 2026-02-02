const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
    const filePath = getFilePath(collection);
    if (!fs.existsSync(filePath)) {
        return [];
    }
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${collection}:`, error);
        return [];
    }
};

const writeData = (collection, data) => {
    const filePath = getFilePath(collection);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${collection}:`, error);
        return false;
    }
};

// Helper for finding one item
const findOne = (collection, query) => {
    const items = readData(collection);
    return items.find(item => {
        return Object.keys(query).every(key => item[key] === query[key]);
    });
};

// Helper for finding multiple items
const find = (collection, query = {}) => {
    const items = readData(collection);
    if (Object.keys(query).length === 0) return items;

    return items.filter(item => {
        return Object.keys(query).every(key => item[key] === query[key]);
    });
};

// Helper for finding by ID
const findById = (collection, id) => {
    const items = readData(collection);
    // Determine ID key (could be _id or id)
    return items.find(item => (item._id === id || item.id === id));
};

// Helper for creating item
const create = (collection, item) => {
    const items = readData(collection);
    const newItem = {
        _id: Date.now().toString(), // Simple ID generation
        createdAt: new Date().toISOString(),
        ...item
    };
    items.push(newItem);
    writeData(collection, items);
    return newItem;
};

// Helper for updating item by query
const update = (collection, query, updates) => {
    let items = readData(collection);
    let updatedItem = null;

    items = items.map(item => {
        const isMatch = Object.keys(query).every(key => item[key] === query[key]);
        if (isMatch) {
            updatedItem = { ...item, ...updates };
            return updatedItem;
        }
        return item;
    });

    if (updatedItem) {
        writeData(collection, items);
    }
    return updatedItem;
};

// Helper for updating by ID
const findByIdAndUpdate = (collection, id, updates) => {
    let items = readData(collection);
    let updatedItem = null;

    items = items.map(item => {
        if (item._id === id || item.id === id) {
            updatedItem = { ...item, ...updates };
            return updatedItem;
        }
        return item;
    });

    if (updatedItem) {
        writeData(collection, items);
    }
    return updatedItem;
};

// Helper for removing all items (seeder)
const deleteMany = (collection) => {
    writeData(collection, []);
};

// Helper for inserting many (seeder)
const insertMany = (collection, items) => {
    writeData(collection, items);
};

module.exports = {
    readData,
    writeData,
    findOne,
    find,
    findById,
    create,
    update,
    findByIdAndUpdate,
    deleteMany,
    insertMany
};
