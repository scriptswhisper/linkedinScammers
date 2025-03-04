export interface Report {
    _id: string;
    reportedBy: {
        _id: string;
        username: string;
        email: string;
    };
    scamType: string;
    notes: string;
    createdAt: string;
}

export interface ScammerResponse {
    _id: string;
    profileLink: string;
    name: string;
    company: string;
    totalReports: number;
    reports: Report[];
    firstReportedAt: string;
    lastReportedAt: string;
}