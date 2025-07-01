import React, { useContext } from 'react';
import { Container, Typography } from '../../atoms';
import { Button } from '../';
import { NightModeContext } from '../../../contexts/NightModeContext'; // Importer le contexte night mode
import { FaTimes, FaArrowLeft } from 'react-icons/fa';

const ErrorScreen = ({ error, onBackToHome }) => {
    const { nightMode } = useContext(NightModeContext); // Récupérer l'état du night mode

    const loadingErrorStyle = {
        backgroundColor: nightMode ? "#1a1a1a" : "white",
        color: nightMode ? "white" : "black",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center"
    };

    return (
        // Écran d'erreur avec night mode
        <Container.Base style={loadingErrorStyle}>
            <FaTimes style={{
                fontSize: "3rem",
                color: "#dc3545",
                marginBottom: "1rem"
            }} />
            <Typography.Title style={{ color: nightMode ? "white" : "black" }}>
                {error || "Enquête introuvable"}
            </Typography.Title>
            <Button.Default
                callBack={onBackToHome}
                style={{
                    marginTop: "1rem",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                <FaArrowLeft style={{ marginRight: "0.5rem" }} />
                Retour à l'accueil
            </Button.Default>
        </Container.Base>
    );
};

export default ErrorScreen;
