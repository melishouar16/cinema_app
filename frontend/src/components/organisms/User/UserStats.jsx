import React, { useContext } from 'react';
import { Typography } from '../../atoms';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaGamepad, FaTrophy, FaClock } from 'react-icons/fa';

const UserStats = ({ stats }) => {
    const { nightMode } = useContext(NightModeContext);

    if (!stats) return null;

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
    };

    const statCardStyle = {
        backgroundColor: nightMode ? '#2c3e50' : 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: nightMode
            ? '0 4px 15px rgba(0,0,0,0.3)'
            : '0 4px 15px rgba(0,0,0,0.1)',
        textAlign: 'center'
    };

    const StatCard = ({ icon, value, label, iconColor }) => (
        <div style={statCardStyle}>
            {React.cloneElement(icon, {
                style: { fontSize: '2rem', color: iconColor, marginBottom: '0.5rem' }
            })}
            <Typography.Title style={{ fontSize: '2rem', margin: '0' }}>
                {value}
            </Typography.Title>
            <Typography.Paragraph style={{ margin: '0', color: '#7f8c8d' }}>
                {label}
            </Typography.Paragraph>
        </div>
    );

    return (
        <div style={statsGridStyle}>
            <StatCard
                icon={<FaGamepad />}
                value={stats.totalEnquetes}
                label="Enquêtes jouées"
                iconColor="#3498db"
            />
            <StatCard
                icon={<FaTrophy />}
                value={stats.enquetesTerminees}
                label="Terminées"
                iconColor="#27AE60"
            />
            <StatCard
                icon={<FaClock />}
                value={stats.tempsJeuEstime}
                label="Temps de jeu"
                iconColor="#9b59b6"
            />
        </div>
    );
};

export default UserStats;
