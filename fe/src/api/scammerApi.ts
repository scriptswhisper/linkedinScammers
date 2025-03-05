/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const VITE_ENV_MODE = (import.meta as any).env?.VITE_ENV_MODE || 'development';
const VITE_PROD_SERVER_URL = (import.meta as any).env?.VITE_PROD_SERVER_URL || 'https://production.example.com';
const VITE_LOCAL_SERVER_URL = (import.meta as any).env?.VITE_LOCAL_SERVER_URL || 'http://localhost:3005';

let API_URL: string;

if (VITE_ENV_MODE === 'production') {
    API_URL = VITE_PROD_SERVER_URL;
} else {
    API_URL = VITE_LOCAL_SERVER_URL;
}

console.log("API_URL in fe scammerApi.ts:", API_URL);


export interface ScammerSearchResponse {
    success: boolean;
    found: boolean;
    report: {
        totalReports: number;
        firstReportedAt: string;
        lastReportedAt: string;
        name?: string;
        company?: string;
        reports: Array<{
            _id: string;
            reportedBy: {
                _id: string;
                username: string;
            };
            scamType: string;
            notes: string;
            createdAt: string;
        }>;
    } | null;
}


// Aggiorna l'interfaccia ScammerReport per rendere name e company opzionali
export interface ScammerReport {
    profileLink: string;
    name?: string;   // Ora è opzionale
    company?: string; // Ora è opzionale
    scamType: "download-suspicios-repo" | "download-suspicios-software" | "investment-scam" | "romance-scam" | "other";
    notes: string;
}

export const reportScammer = async (data: ScammerReport, token: string) => {
    const response = await axios.post(`${API_URL}/api/scammers`, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const getScammers = async (token: string) => {
    const response = await axios.get(`${API_URL}/api/scammers`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const searchScammer = async (profileLink: string, token: string) => {
    const response = await axios.get(`${API_URL}/api/scammers/search`, {
        params: { profileLink },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Aggiungi questa funzione per eliminare i report
export const deleteReport = async (scammerId: string, reportId: string, token: string) => {
    const response = await axios.delete(
        `${API_URL}/api/scammers/${scammerId}/reports/${reportId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response.data;
};