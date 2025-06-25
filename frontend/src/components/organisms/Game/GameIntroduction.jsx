import React, { useContext } from 'react';
import { Container, Typography, Card } from '../../atoms';
import { Button } from '../../molecules';
import { NightModeContext } from '../../../contexts/NightModeContext'; // Importer le contexte
import { FaBriefcase, FaTimes, FaSearch } from 'react-icons/fa';

const GameIntroduction = ({ scenario, onStartInvestigation }) => {
    const { nightMode } = useContext(NightModeContext); // Récupérer l'état du night mode

    // Styles dynamiques selon le night mode
    const cardBackgroundColor = nightMode ? "#2d2d2d" : "#f8f9fa";
    const titleColor = nightMode ? "white" : "#333";
    const innerCardBg = nightMode ? "#3d3d3d" : "white";
    const contextTextColor = nightMode ? "#ccc" : "black";
    const descriptionColor = nightMode ? "#aaa" : "#666";

    return (
        <Card.PhaseCard style={{
            backgroundColor: cardBackgroundColor,
            textAlign: "center",
            padding: "3rem"
        }}>
            <Typography.SubTitle style={{
                marginBottom: "2rem",
                color: titleColor
            }}>
                <FaBriefcase style={{ marginRight: "0.5rem" }} />
                Briefing de l'enquête
            </Typography.SubTitle>

            <Container.Base
                style={{
                    backgroundColor: innerCardBg,
                    padding: "2rem",
                    borderRadius: "8px",
                    marginBottom: "2rem",
                    textAlign: "left",
                    boxShadow: nightMode ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <Typography.Paragraph style={{
                    marginBottom: "1.5rem",
                    lineHeight: "1.7",
                    fontSize: "1.1rem",
                    color: contextTextColor
                }}>
                    <strong>Contexte :</strong> {scenario.contexte}
                </Typography.Paragraph>

                <Container.Base
                    style={{
                        backgroundColor: nightMode ? "#4a4035" : "#fff3cd", // Adapté pour night mode
                        padding: "1.5rem",
                        borderRadius: "6px",
                        border: nightMode ? "1px solid #6b5b47" : "1px solid #ffeaa7",
                    }}
                >
                    <Typography.SubTitle style={{
                        fontSize: "1.2rem",
                        marginBottom: "1rem",
                        color: nightMode ? "#f4d03f" : "#856404" // Jaune en night mode
                    }}>
                        <FaTimes style={{ marginRight: "0.5rem" }} />
                        Le Crime
                    </Typography.SubTitle>
                    <Typography.Paragraph style={{
                        margin: 0,
                        color: nightMode ? "#e8d5a3" : "#856404",
                        fontWeight: "500",
                        fontSize: "1.1rem"
                    }}>
                        {scenario.crime}
                    </Typography.Paragraph>
                </Container.Base>
            </Container.Base>

            <Typography.Paragraph style={{
                marginBottom: "2rem",
                color: descriptionColor,
                fontSize: "1rem"
            }}>
                Vous êtes le détective en charge de cette affaire. Collectez des preuves, interrogez les suspects, et
                résolvez le mystère.
            </Typography.Paragraph>

            <Button.GameButton
                callBack={onStartInvestigation}
                bgColor="#4A90E2"
                style={{
                    padding: "1.2rem 3rem",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    backgroundColor: "#4A90E2"
                }}
            >
                <FaSearch style={{ marginRight: "0.5rem" }} />
                COMMENCER L'ENQUÊTE
            </Button.GameButton>
        </Card.PhaseCard>
    );
};

export default GameIntroduction;
