export interface Report {
    _id: string;
    reportedBy: {
        _id: string;
        username: string;
    };
    name: string;
    company: string;
    scamType: string;
    notes: string;
    createdAt: string;
}

export interface ScammerResponse {
    _id: string;
    profileLink: string;
    reports: Report[];
    totalReports: number;
    firstReportedAt: string;
    lastReportedAt: string;
    createdAt: string;
    updatedAt: string;
}