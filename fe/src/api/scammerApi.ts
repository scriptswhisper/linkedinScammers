import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3005';

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