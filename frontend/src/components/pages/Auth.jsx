import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserDashboard } from '../organisms/User';
import { AuthTabs } from '../organisms/Auth';

const Auth = ({ onNavigate }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated
        ? <UserDashboard onNavigate={onNavigate} />
        : <AuthTabs />;
};

export default Auth;
