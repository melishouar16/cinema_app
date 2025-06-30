import React, { useContext } from 'react';
import { Typography } from '../../atoms';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const UserProfile = ({ user, onLogout }) => {
    const { nightMode } = useContext(NightModeContext);

    const profileHeaderStyle = {
        background: nightMode ? '#2c3e50' : '#3498db',
        borderRadius: '15px',
        padding: '2rem',
        color: 'white',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        boxShadow: nightMode
            ? '0 4px 15px rgba(0,0,0,0.3)'
            : '0 4px 15px rgba(0,0,0,0.1)'
    };

    const avatarStyle = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem'
    };

    const logoutButtonStyle = {
        background: 'rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '8px',
        padding: '8px 16px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        cursor: 'pointer',
        fontFamily: 'inherit'
    };

    return (
        <div style={profileHeaderStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={avatarStyle}>
                    <FaUser />
                </div>
                <div>
                    <Typography.Title style={{ margin: '0', fontSize: '1.8rem' }}>
                        Bonjour {user?.first_name || user?.username} !
                    </Typography.Title>
                    <Typography.Paragraph style={{ margin: '0', opacity: '0.9' }}>
                        {user?.email} • Rôle: {user?.profile?.role || 'utilisateur'}
                    </Typography.Paragraph>
                </div>
            </div>
            <button onClick={onLogout} style={logoutButtonStyle}>
                <FaSignOutAlt /> Déconnexion
            </button>
        </div>
    );
};

export default UserProfile;
