import React, { useContext } from 'react';
import { Typography } from '../../atoms';
import Rating from '../../atoms/Rating';
import { NightModeContext } from '../../../contexts/NightModeContext';

const Display = ({ rating = 0, count = 0 }) => {
    const { nightMode } = useContext(NightModeContext);

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Rating rating={rating} />
            <Typography.Paragraph style={{
                color: nightMode ? '#ccc' : '#666',
                fontSize: '0.9rem',
                margin: '0 0 0 0.5rem'
            }}>
                {rating.toFixed(1)} ({count} avis)
            </Typography.Paragraph>
        </div>
    );
};

export default Display;
