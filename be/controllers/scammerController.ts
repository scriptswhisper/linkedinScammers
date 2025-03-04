import { Request, Response } from 'express';
import { Scammer } from '../models/Scammer';
import '../types/express';
import mongoose from 'mongoose';

// Improved function to normalize LinkedIn profile URLs
function normalizeProfileLink(url: string): string {
    if (!url) return '';

    // Convert to lowercase
    let normalized = url.toLowerCase().trim();

    // Remove tracking parameters (anything after ? or #)
    normalized = normalized.split(/[?#]/)[0];

    // Remove trailing slashes
    normalized = normalized.replace(/\/+$/, '');

    // Handle different variations of LinkedIn domains
    normalized = normalized.replace(/https?:\/\/(www\.)?(linkedin\.com|lnkd\.in)\//, 'linkedin.com/');

    // Ensure it starts with linkedin.com if it doesn't have a protocol
    if (!normalized.startsWith('http') && !normalized.startsWith('linkedin.com')) {
        normalized = 'linkedin.com/' + normalized;
    }

    return normalized;
}

export const createScammer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profileLink: rawProfileLink, name, company, scamType, notes } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
                errorCode: 'AUTH_REQUIRED'
            });
            return;
        }

        // Normalize the profile link for consistent matching
        const profileLink = normalizeProfileLink(rawProfileLink);

        // Elegant approach: Use $elemMatch to directly check for duplicate reports
        const duplicateExists = await Scammer.findOne({
            profileLink,
            reports: {
                $elemMatch: {
                    reportedBy: userId
                }
            }
        });

        if (duplicateExists) {
            console.log("DUPLICATE: User has already reported this LinkedIn profile");
            res.status(400).json({
                success: false,
                message: 'You have already reported this LinkedIn profile',
                errorCode: 'DUPLICATE_REPORT'
            });
            return;
        }

        // Rest of your function remains the same...

    } catch (error) {
        console.error('Error creating/updating scammer:', error);

        // Special handling for duplicate key errors from MongoDB
        if (error instanceof mongoose.Error && error.name === 'MongoError' && (error as any).code === 11000) {
            res.status(400).json({
                success: false,
                message: 'You have already reported this LinkedIn profile',
                errorCode: 'DUPLICATE_REPORT'
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Error processing scammer report',
            error: error instanceof Error ? error.message : 'Unknown error',
            errorCode: 'SERVER_ERROR'
        });
    }
};
export const getScammers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const scammers = await Scammer.find()
            .populate('reports.reportedBy', 'username')
            .sort({ lastReportedAt: -1 });
        res.json(scammers);
    } catch (error) {
        console.error('Error fetching scammers:', error);
        res.status(500).json({
            message: 'Error fetching scammers',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const searchScammer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profileLink: rawProfileLink } = req.query;

        if (!rawProfileLink || typeof rawProfileLink !== 'string') {
            res.status(400).json({ message: 'Profile link is required' });
            return;
        }

        const profileLink = normalizeProfileLink(rawProfileLink);
        console.log('Searching for profile:', profileLink);

        const scammer = await Scammer.findOne({ profileLink })
            .populate('reports.reportedBy', 'username');

        if (!scammer) {
            console.log('No scammer found for profile:', profileLink);
            res.json({ found: false });
            return;
        }

        console.log('Search response:', { found: true, report: scammer });
        res.json({
            found: true,
            report: scammer
        });
    } catch (error) {
        console.error('Error searching scammer:', error);
        res.status(500).json({
            message: 'Error searching for scammer',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};