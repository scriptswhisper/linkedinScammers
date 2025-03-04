import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Scammer } from '../models/Scammer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const USERS_COUNT = 50;
const SCAMMERS_COUNT = 30;
const MAX_REPORTS_PER_SCAMMER = 15;

// Add mongoose connection options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
};

interface TestUser {
    _id: mongoose.Types.ObjectId;
    username: string;
    linkedinId: string;
}

const generateFakeUsers = async (): Promise<TestUser[]> => {
    const users: TestUser[] = [];

    for (let i = 0; i < USERS_COUNT; i++) {
        const user = new User({
            username: faker.internet.username(), // Updated from userName() to username()
            linkedinId: faker.string.uuid(),
            profilePicture: faker.image.avatar(),
            isActive: true,
        });
        await user.save();
        users.push(user);
    }

    return users;
};

const generateFakeScammers = async (users: TestUser[]) => {
    const scamTypes = [
        'download-suspicios-repo',
        'download-suspicios-software',
        'investment-scam',
        'romance-scam',
        'other'
    ];
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    for (let i = 0; i < SCAMMERS_COUNT; i++) {
        const reportsCount = faker.number.int({ min: 1, max: MAX_REPORTS_PER_SCAMMER });
        const reports: {
            reportedBy: mongoose.Types.ObjectId;
            name: string;
            company: string;
            scamType: string;
            notes: string;
            createdAt: Date;
            updatedAt: Date;
        }[] = [];

        for (let j = 0; j < reportsCount; j++) {
            const reportDate = faker.date.between({
                from: oneMonthAgo,
                to: new Date()
            });

            const report = {
                reportedBy: users[faker.number.int({ min: 0, max: users.length - 1 })]._id,
                name: faker.person.fullName(),
                company: faker.company.name(),
                scamType: scamTypes[faker.number.int({ min: 0, max: scamTypes.length - 1 })],
                notes: faker.lorem.paragraph(),
                createdAt: reportDate,
                updatedAt: reportDate
            };
            reports.push(report);
        }

        const scammer = new Scammer({
            profileLink: `linkedin.com/in/${faker.internet.username()}`, // Updated from userName()
            reports: reports,
            totalReports: reports.length,
            firstReportedAt: reports[0].createdAt,
            lastReportedAt: reports[reports.length - 1].createdAt
        });

        await scammer.save();
    }
};

const seedDatabase = async () => {
    let connection: typeof mongoose | null = null;
    try {
        if (!process.env.MONGO_URI_TEST) {
            throw new Error('MONGO_URI_TEST environment variable is not defined');
        }

        // Establish connection first
        console.log('Connecting to MongoDB...');
        connection = await mongoose.connect(process.env.MONGO_URI_TEST, mongooseOptions);
        console.log('Connected to MongoDB successfully');

        // Check if collections exist before trying to delete
        if (!connection.connection.db) {
            throw new Error('Database connection is not established');
        }
        const collections = await connection.connection.db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        if (collectionNames.includes('users')) {
            console.log('Clearing users collection...');
            await User.deleteMany({});
        }

        if (collectionNames.includes('scammers')) {
            console.log('Clearing scammers collection...');
            await Scammer.deleteMany({});
        }

        console.log('Generating fake users...');
        const users = await generateFakeUsers();
        console.log(`${users.length} users generated`);

        console.log('Generating fake scammers and reports...');
        await generateFakeScammers(users);
        console.log(`${SCAMMERS_COUNT} scammers generated`);

        console.log('Seeding completed successfully!');
        await connection.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        if (connection) {
            await connection.disconnect();
        }
        process.exit(1);
    }
};

// Handle process termination
process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
});

seedDatabase();