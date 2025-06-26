import React from 'react';

const ProgressBar = ({ current, total }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    return (
        <div style={{
            width: '100%',
            backgroundColor: '#374151',
            borderRadius: '4px',
            height: '8px'
        }}>
            <div style={{
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: '4px',
                width: `${percentage}%`,
                transition: 'width 0.3s ease'
            }} />
        </div>
    );
};

export default ProgressBar;
