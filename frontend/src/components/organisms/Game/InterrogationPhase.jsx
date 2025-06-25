import React, { useContext } from 'react';
import { Container, Typography, Card } from '../../atoms';
import { Button } from '../../molecules';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaUsers, FaGavel, FaUser, FaComments } from 'react-icons/fa';

const InterrogationPhase = ({
    scenario,
    interrogatedSuspects,
    onInterrogate,
    isComplete,
    onNextPhase
}) => {
    const { nightMode } = useContext(NightModeContext);

    // adapter au night mode
    const cardBg = nightMode ? "#2d2d2d" : "white";
    const titleColor = "#856404"; // Garder la couleur thématique
    const textColor = nightMode ? "#ccc" : "black";

    return (
        <Card.PhaseCard
            borderColor="#ffc107"
            style={{ backgroundColor: cardBg }}
        >
            <Typography.SubTitle style={{
                marginBottom: "1.5rem",
                color: titleColor
            }}>
                <FaUsers style={{ marginRight: "0.5rem" }} />
                Phase d'Interrogatoire
            </Typography.SubTitle>

            <Typography.Paragraph style={{
                marginBottom: "2rem",
                color: textColor
            }}>
                Interrogez les suspects pour découvrir leurs motivations et alibis. Chaque interrogatoire révèle des
                informations cruciales.
            </Typography.Paragraph>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1rem",
                    marginBottom: "2rem",
                }}
            >
                {scenario.suspects?.map((suspect, index) => {
                    const isInterrogated = interrogatedSuspects.find((s) => s.nom === suspect.nom);

                    return (
                        <Container.Base
                            key={index}
                            style={{
                                backgroundColor: isInterrogated
                                    ? (nightMode ? "#3d3525" : "#fff3cd")
                                    : (nightMode ? "#3d3d3d" : "#f8f9fa"),
                                padding: "1.5rem",
                                borderRadius: "8px",
                                border: nightMode ? "1px solid #555" : "1px solid #dee2e6",
                            }}
                        >
                            <Typography.Paragraph style={{
                                fontWeight: "bold",
                                fontSize: "1.1rem",
                                marginBottom: "1rem",
                                color: nightMode ? "#fff" : "black"
                            }}>
                                <FaUser style={{ marginRight: "0.5rem" }} />
                                {suspect.nom}
                            </Typography.Paragraph>

                            <Typography.Paragraph style={{
                                margin: "0.5rem 0",
                                fontSize: "0.9rem",
                                color: nightMode ? "#ccc" : "black"
                            }}>
                                {suspect.description}
                            </Typography.Paragraph>

                            {isInterrogated ? (
                                <Container.Base
                                    style={{
                                        backgroundColor: nightMode ? "#4a4035" : "#fff",
                                        padding: "1rem",
                                        borderRadius: "4px",
                                        marginTop: "1rem",
                                        border: nightMode ? "1px solid #6b5b47" : "1px solid #ffeaa7",
                                    }}
                                >
                                    <div style={{
                                        marginBottom: "0.5rem",
                                        color: nightMode ? "#e8d5a3" : "black"
                                    }}>
                                        <strong>Mobile :</strong> {suspect.mobile}
                                    </div>
                                    <div style={{
                                        color: nightMode ? "#e8d5a3" : "black"
                                    }}>
                                        <strong>Alibi :</strong> {suspect.alibi}
                                    </div>
                                </Container.Base>
                            ) : (
                                <Button.GameButton
                                    callBack={() => onInterrogate(suspect)}
                                    bgColor="#ffc107"
                                    textColor="black"
                                >
                                    <FaComments style={{ marginRight: "0.5rem" }} />
                                    Interroger
                                </Button.GameButton>
                            )}
                        </Container.Base>
                    );
                })}
            </div>

            <div style={{ textAlign: "center" }}>
                <Typography.Paragraph style={{
                    marginBottom: "1rem",
                    color: textColor
                }}>
                    Suspects interrogés: {interrogatedSuspects.length}/{scenario.suspects?.length || 0}
                </Typography.Paragraph>
                {isComplete && (
                    <Button.GameButton callBack={onNextPhase} bgColor="#dc3545">
                        <FaGavel style={{ marginRight: "0.5rem" }} />
                        Procéder à l'Accusation
                    </Button.GameButton>
                )}
            </div>
        </Card.PhaseCard>
    );
};

export default InterrogationPhase;
