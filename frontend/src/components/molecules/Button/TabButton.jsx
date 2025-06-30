import React, { useContext } from 'react';
import { NightModeContext } from '../../../contexts/NightModeContext';

const TabButton = ({ active, onClick, children, activeColor = '#4A90E2', ...props }) => {
    const { nightMode } = useContext(NightModeContext);

    const buttonStyle = {
        padding: '1rem 2rem',
        border: 'none',
        backgroundColor: active ? activeColor : 'transparent',
        color: active ? 'white' : nightMode ? 'white' : '#333',
        cursor: 'pointer',
        borderBottom: active ? `2px solid ${activeColor}` : 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        ...props.style
    };

    return (
        <button onClick={onClick} style={buttonStyle} {...props}>
            {children}
        </button>
    );
};

export default TabButton;
