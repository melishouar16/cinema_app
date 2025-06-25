
import React, { useContext } from 'react';
import { Container, Typography, Card } from '../../atoms';
import { Button } from '../../molecules';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaTrophy, FaTimes, FaSearch, FaCheckCircle, FaHome, FaRedo } from 'react-icons/fa';

const GameSolution = ({ scenario, hasWon, finalAccusation, onBackToHome }) => {
    const { nightMode } = useContext(NightModeContext);

    // adapter selon victoire/defaite et night mode
    const getBgColor = () => {
        if (hasWon) {
            return nightMode ? "#1e3a2e" : "#d4edda"; // Vert foncé en night mode
        }
        return nightMode ? "#3a1e1e" : "#f8d7da"; // Rouge foncé en night mode
    };

    const getTitleColor = () => {
        if (hasWon) {
            return nightMode ? "#4ade80" : "#155724"; // Vert clair en night mode
        }
        return nightMode ? "#f87171" : "#721c24"; // Rouge clair en night mode
    };

    const getTextColor = () => {
        if (hasWon) {
            return nightMode ? "#4ade80" : "#721c24";
        }
        return nightMode ? "#f87171" : "#721c24";
    };

    const explanationBg = nightMode ? "#3d3d3d" : "white";
    const explanationTextColor = nightMode ? "#ccc" : "black";

    return (
        <Card.PhaseCard
            borderColor={hasWon ? "#28a745" : "#dc3545"}
            style={{
                backgroundColor: getBgColor(),
                textAlign: "center",
                padding: "3rem",
            }}
        >
            <Typography.Title style={{
                color: getTitleColor(),
                marginBottom: "2rem"
            }}>
                {hasWon ? (
                    <>
                        <FaTrophy style={{ marginRight: "0.5rem" }} />
                        ENQUÊTE RÉSOLUE !
                    </>
                ) : (
                    <>
                        <FaTimes style={{ marginRight: "0.5rem" }} />
                        ENQUÊTE ÉCHOUÉE
                    </>
                )}
            </Typography.Title>

            {!hasWon && (
                <Typography.Paragraph
                    style={{
                        marginBottom: "1.5rem",
                        fontSize: "1.1rem",
                        color: getTextColor(),
                    }}
                >
                    Vous avez accusé <strong>{finalAccusation}</strong>, mais ce n'était pas le bon coupable.
                </Typography.Paragraph>
            )}

            <Typography.SubTitle style={{
                marginBottom: "2rem",
                fontSize: "1.3rem",
                color: nightMode ? "white" : "black"
            }}>
                Le vrai coupable était : <strong>{scenario.solution?.coupable}</strong>
            </Typography.SubTitle>

            <Container.Base
                style={{
                    backgroundColor: explanationBg,
                    padding: "2rem",
                    borderRadius: "8px",
                    marginBottom: "2rem",
                    textAlign: "left",
                }}
            >
                <Typography.Paragraph style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.6",
                    margin: 0,
                    color: explanationTextColor
                }}>
                    <strong>
                        <FaSearch style={{ marginRight: "0.5rem" }} />
                        Explication :
                    </strong>{" "}
                    {scenario.solution?.revelation}
                </Typography.Paragraph>

                {scenario.solution?.indices_cles && (
                    <div style={{ marginTop: "1.5rem" }}>
                        <strong style={{ color: explanationTextColor }}>
                            <FaCheckCircle style={{ marginRight: "0.5rem" }} />
                            Indices clés :
                        </strong>
                        <ul style={{
                            marginTop: "0.5rem",
                            color: explanationTextColor
                        }}>
                            {scenario.solution.indices_cles.map((indice, index) => (
                                <li key={index} style={{ marginBottom: "0.5rem" }}>
                                    {indice}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Container.Base>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Button.GameButton callBack={onBackToHome} bgColor="#4A90E2">
                    <FaHome style={{ marginRight: "0.5rem" }} />
                    Retour à l'accueil
                </Button.GameButton>
                <Button.GameButton callBack={() => window.location.reload()} bgColor="#28a745">
                    <FaRedo style={{ marginRight: "0.5rem" }} />
                    Recommencer
                </Button.GameButton>
            </div>
        </Card.PhaseCard>
    );
};

export default GameSolution;
