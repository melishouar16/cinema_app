// frontend/src/components/organisms/Game/GameHeader.jsx
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
                padding: "1rem 2rem",
                backgroundColor: nightMode ? "#0d1117" : "#1a1a1a",
                color: "white",
                borderRadius: "8px",
                maxWidth: "1000px",
                margin: "0 auto 2rem auto",
            }}
        >
            <div>
                <Typography.Title style={{
                    color: "white",
                    margin: 0,
                    fontSize: "1.5rem"
                }}>
                    <FaSearch style={{ marginRight: "0.5rem" }} />
                    {scenario.titre}
                </Typography.Title>
                <Typography.Paragraph style={{
                    color: "#ccc",
                    margin: "0.3rem 0 0 0",
                    fontSize: "0.9rem"
                }}>
                    Enquête criminelle • {enquete.film_source?.titre || "Source inconnue"}
                </Typography.Paragraph>
            </div>

            <Button.GameButton
                callBack={onBackToHome}
                bgColor="transparent"
                textColor="white"
                style={{
                    border: "1px solid white",
                    padding: "0.5rem 1rem"
                }}
            >
                <FaArrowLeft style={{ marginRight: "0.5rem" }} />
                Quitter
            </Button.GameButton>
        </Container.Flex>
    );
};

export default GameHeader;
