import React from 'react';
import { Container, Typography } from '../index';

const ScoreDisplay = ({ score, icon: IconComponent, emoji, grade, color, size = 'medium' }) => {
    const isLarge = size === 'large';


    const displayIcon = IconComponent ? <IconComponent /> : emoji;

    return (
        <Container.Base style={{
            textAlign: 'center',
            padding: isLarge ? '20px' : '10px',
            border: `2px solid ${color}`,
            borderRadius: '10px',
            background: 'rgba(0,0,0,0.1)'
        }}>
            <div style={{
                fontSize: isLarge ? '3rem' : '1.5rem',
                marginBottom: '5px',
                color: color
            }}>
                {displayIcon}
            </div>
            <Typography.Title style={{
                color: color,
                fontSize: isLarge ? '2rem' : '1.2rem',
                margin: '5px 0'
            }}>
                {score}
            </Typography.Title>
            <Typography.Paragraph style={{
                color: color,
                fontSize: isLarge ? '1rem' : '0.8rem',
                margin: 0
            }}>
                {grade}
            </Typography.Paragraph>
        </Container.Base>
    );
};

export default ScoreDisplay;
