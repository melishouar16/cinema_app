import React, { useContext } from 'react';
import { Container, Typography } from '../../atoms';
import { NightModeContext } from '../../../contexts/NightModeContext'; // Importer le contexte night mode

const AuthGuard = ({ onNavigate }) => {
    const { nightMode } = useContext(NightModeContext); // Récupérer l'état du night mode

    const pageStyle = {
        backgroundColor: nightMode ? "#1a1a1a" : "white",
        color: nightMode ? "white" : "black",
        minHeight: "100vh",
        padding: "2rem",
        maxWidth: "1000px",
        margin: "0 auto",
        textAlign: 'center'
    };

    return (
        <Container.Base style={pageStyle}>
            <Typography.Title style={{ color: nightMode ? "white" : "black" }}>
                Accès refusé
            </Typography.Title>
            <Typography.Paragraph style={{ color: nightMode ? "#ccc" : '#666' }}>
                Vous devez être connecté pour jouer à une enquête.
            </Typography.Paragraph>
            <button
                onClick={() => onNavigate("connexion")}
                style={{
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '1rem'
                }}
            >
                Se connecter
            </button>
        </Container.Base>
    );
};

export default AuthGuard;
