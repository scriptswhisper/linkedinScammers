import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectTestDB = async (): Promise<void> => {
    try {
        const testMongoURI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/linkedin-scammers-test';
        await mongoose.connect(testMongoURI);
        console.log('Connected to Test MongoDB');
    } catch (error) {
        console.error('Test DB connection error:', error);
        process.exit(1);
    }
};

const clearTestDB = async (): Promise<void> => {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Attempted to clear non-test database! Operation aborted.');
    }

    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};

const disconnectTestDB = async (): Promise<void> => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};

export { connectTestDB, clearTestDB, disconnectTestDB };