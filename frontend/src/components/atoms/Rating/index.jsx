import React from 'react';

const Rating = ({ rating = 0, maxStars = 5, size = '1.1rem', color = '#ffc107' }) => {
    const fullStars = Math.round(rating);
    const emptyStars = maxStars - fullStars;

    return (
        <span style={{ color, fontSize: size }}>
            {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
        </span>
    );
};

export default Rating;
