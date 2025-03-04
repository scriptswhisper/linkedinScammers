import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';
// OR if AuthContext is in /fe/context/
// import { AuthContext, AuthContextType } from '../../context/AuthContext';

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};