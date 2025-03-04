import axios from 'axios';

// Using a type assertion to avoid TypeScript error until vite-env.d.ts is loaded
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3005/api/scammers';

export interface ScammerReport {
    profileLink: string;
    name: string;
    company: string;
    scamType: 'job_offer' | 'recruitment' | 'investment' | 'phishing' | 'malicious_video_call' | 'malicious_repo' | 'other';
    notes: string;
}

export interface ScammerSearchResponse {
    found: boolean;
    report?: ScammerResponse;
}

export interface ScammerResponse {
    _id: string;
    profileLink: string;
    name: string;
    company: string;
    totalReports: number;
    reports: Array<{
        _id: string;
        reportedBy: {
            _id: string;
            username: string;
            email: string;
        };
        scamType: string;
        notes: string;
        createdAt: string;
    }>;
    firstReportedAt: string;
    lastReportedAt: string;
}

export const reportScammer = async (data: ScammerReport, token: string): Promise<ScammerResponse> => {
    try {
        console.log('Sending scammer report:', data);
        const response = await axios.post<ScammerResponse>(API_URL, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Server response:', response.data);
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error reporting scammer:', error);
        if (error.response) {
            console.log('Response data:', error.response.data);
            console.log('Status:', error.response.status);
        }
        throw error;
    }
};

export const getScammers = async (token: string): Promise<ScammerResponse[]> => {
    try {
        const response = await axios.get<ScammerResponse[]>(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Fetched scammers:', response.data);
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error fetching scammers:', error);
        if (error.response) {
            console.log('Response data:', error.response.data);
            console.log('Status:', error.response.status);
        }
        throw error;
    }
};

export const searchScammer = async (profileLink: string, token: string): Promise<ScammerSearchResponse> => {
    try {
        console.log('Searching for profile:', profileLink);
        const response = await axios.get<ScammerSearchResponse>(`${API_URL}/search`, {
            params: { profileLink },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Search response:', response.data);
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error searching for scammer:', error);
        if (error.response) {
            console.log('Response data:', error.response.data);
            console.log('Status:', error.response.status);
        }
        throw error;
    }
};