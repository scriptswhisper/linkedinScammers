import { Request, Response } from 'express';
import { Scammer, IScammer, IReportInput } from '../models/Scammer';
import mongoose from 'mongoose';
import '../types/express';

function normalizeProfileLink(url: string): string {

    if (!url) return '';

    let normalized = url.toLowerCase().trim();

    // Remove any protocol, www, and extra spaces
    normalized = normalized
        .replace(/^https?:\/\/(www\.)?/, '')
        .replace(/\s+/g, '');

    // Extract the username part after /in/
    const inMatch = normalized.match(/linkedin\.com\/in\/([^\/\?#]+)/i);
    if (inMatch) {
        normalized = `linkedin.com/in/${inMatch[1]}`;
    } else if (!normalized.includes('linkedin.com/in/')) {
        // If the URL doesn't contain /in/, assume it's just the username
        const username = normalized.replace(/^.*?([^\/\?#]+)$/, '$1');
        normalized = `linkedin.com/in/${username}`;
    }




    return normalized;
}
// Create scammer report
export const createScammer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profileLink: rawProfileLink, name, company, scamType, notes } = req.body;

        // Fornisci valori predefiniti per name e company se mancanti
        const defaultName = name || "Unknown User";
        const defaultCompany = company || "Unknown Company";

        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
                errorCode: 'AUTH_REQUIRED'
            });
            return;
        }

        const profileLink = normalizeProfileLink(rawProfileLink);
        if (!profileLink) {
            res.status(400).json({
                success: false,
                message: 'Valid profile link is required',
                errorCode: 'INVALID_PROFILE_LINK'
            });
            return;
        }

        let scammer = await Scammer.findOne({ profileLink });

        if (scammer) {
            const alreadyReported = scammer.reports.some(
                report => report.reportedBy.toString() === userId.toString()
            );

            if (alreadyReported) {
                res.status(400).json({
                    success: false,
                    message: 'You have already reported this LinkedIn profile',
                    errorCode: 'DUPLICATE_REPORT'
                });
                return;
            }

            // Crea il report con l'interfaccia corretta
            const newReport: IReportInput = {
                reportedBy: userId,
                name: defaultName,
                company: defaultCompany,
                scamType,
                notes
            };

            // Aggiungi all'array reports
            scammer.reports.push(newReport as any);  // Using 'any' to bypass TS checking

            scammer.lastReportedAt = new Date();
            scammer.totalReports = scammer.reports.length;

            await scammer.save();

            res.status(200).json({
                success: true,
                message: 'Scammer report added to existing profile',
                scammer
            });
        } else {
            // Crea il report iniziale
            const initialReport: IReportInput = {
                reportedBy: userId,
                name: defaultName,
                company: defaultCompany,
                scamType,
                notes
            };

            const newScammer = new Scammer({
                profileLink,
                totalReports: 1,
                reports: [initialReport],
                firstReportedAt: new Date(),
                lastReportedAt: new Date()
            });

            await newScammer.save();

            res.status(201).json({
                success: true,
                message: 'New scammer profile created',
                scammer: newScammer
            });
        }
    } catch (error) {
        console.error('Error creating/updating scammer:', error);

        if (error instanceof mongoose.Error && (error as any).code === 11000) {
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

// Get all scammers
export const getScammers = async (req: Request, res: Response): Promise<void> => {
    try {
        const scammers = await Scammer.find()
            .populate('reports.reportedBy', 'username')
            .sort({ lastReportedAt: -1 });

        res.json({
            success: true,
            count: scammers.length,
            scammers
        });
    } catch (error) {
        console.error('Error fetching scammers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching scammers',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Search for a scammer
// Update the searchScammer function to include more logging
export const searchScammer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profileLink } = req.query;

        if (!profileLink || typeof profileLink !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Profile link is required'
            });
            return;
        }

        const normalizedLink = normalizeProfileLink(profileLink);


        const scammer = await Scammer.findOne({
            profileLink: { $regex: new RegExp('^' + normalizedLink + '$', 'i') }
        }).populate('reports.reportedBy', 'username');

        if (!scammer) {
            res.json({
                success: true,
                found: false,
                report: null
            });
            return;
        }

        res.json({
            success: true,
            found: true,
            report: {
                totalReports: scammer.reports.length,
                firstReportedAt: scammer.firstReportedAt,
                lastReportedAt: scammer.lastReportedAt,
                reports: scammer.reports
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching for scammer'
        });
    }
};
// Delete a specific report
export const deleteReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { scammerId, reportId } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
                errorCode: 'AUTH_REQUIRED'
            });
            return;
        }

        // Trova lo scammer
        const scammer = await Scammer.findById(scammerId);

        if (!scammer) {
            res.status(404).json({
                success: false,
                message: 'Scammer profile not found',
                errorCode: 'NOT_FOUND'
            });
            return;
        }

        // Trova il report specifico
        // Qui ci accertiamo che i report siano già documenti Mongoose con _id
        const reportIndex = scammer.reports.findIndex(
            (report: any) =>  // Utilizziamo any per evitare problemi di tipizzazione
                report._id.toString() === reportId &&
                report.reportedBy.toString() === userId.toString()
        );

        if (reportIndex === -1) {
            res.status(403).json({
                success: false,
                message: 'Report not found or you are not authorized to delete it',
                errorCode: 'FORBIDDEN'
            });
            return;
        }


        // Rimuovi il report
        scammer.reports.splice(reportIndex, 1);

        // Se non ci sono più report, elimina l'intero profilo scammer
        if (scammer.reports.length === 0) {
            await Scammer.findByIdAndDelete(scammerId);

            res.json({
                success: true,
                message: 'Report deleted and scammer profile removed',
            });
        } else {
            // Altrimenti, salva lo scammer con il report rimosso
            scammer.totalReports = scammer.reports.length;
            await scammer.save();

            res.json({
                success: true,
                message: 'Report deleted',
            });
        }
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting report',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};