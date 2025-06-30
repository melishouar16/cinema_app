import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutButton = ({ onLogout, ...props }) => {
    const buttonStyle = {
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
        fontFamily: 'inherit',
        transition: 'all 0.3s ease',
        ...props.style
    };

    return (
        <button onClick={onLogout} style={buttonStyle} {...props}>
            <FaSignOutAlt /> Déconnexion
        </button>
    );
};

export default LogoutButton;
