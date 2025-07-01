import React, { useContext } from 'react';
import { Container, Typography } from '../../atoms';
import { NightModeContext } from '../../../contexts/NightModeContext'; // Importer le contexte night mode
import { FaSearch } from 'react-icons/fa';

const LoadingScreen = () => {
    const { nightMode } = useContext(NightModeContext); // Récupérer l'état du night mode

    const loadingErrorStyle = {
        backgroundColor: nightMode ? "#1a1a1a" : "white",
        color: nightMode ? "white" : "black",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center"
    };

    return (
        // Écran de chargement avec night mode
        <Container.Base style={loadingErrorStyle}>
            <FaSearch style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                color: nightMode ? "white" : "black"
            }} />
            <Typography.Title style={{ color: nightMode ? "white" : "black" }}>
                Chargement de l'enquête...
            </Typography.Title>
        </Container.Base>
    );
};

export default LoadingScreen;
