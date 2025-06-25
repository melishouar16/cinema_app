
import React, { useContext } from 'react';
import { Container, Typography } from '../../atoms';
import { Button } from '../../molecules';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';

const GameHeader = ({ scenario, enquete, onBackToHome }) => {
    const { nightMode } = useContext(NightModeContext);

    return (
        <Container.Flex
            style={{
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                padding: "1.5rem",
                backgroundColor: nightMode ? "#0d1117" : "#1a1a1a", // Plus sombre en night mode
                color: "white",
                borderRadius: "8px",
            }}
        >
            <div>
                <Typography.Title style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>
                    <FaSearch style={{ marginRight: "0.5rem" }} />
                    {scenario.titre}
                </Typography.Title>
                <Typography.Paragraph style={{ color: "#ccc", margin: "0.5rem 0 0 0" }}>
                    Enquête criminelle • {enquete.film_source?.titre || "Source inconnue"}
                </Typography.Paragraph>
            </div>

            <Button.GameButton
                callBack={onBackToHome}
                bgColor="transparent"
                textColor="white"
                style={{ border: "1px solid white" }}
            >
                <FaArrowLeft style={{ marginRight: "0.5rem" }} />
                Quitter
            </Button.GameButton>
        </Container.Flex>
    );
};

export default GameHeader;
