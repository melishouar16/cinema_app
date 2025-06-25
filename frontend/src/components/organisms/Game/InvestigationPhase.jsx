
import React, { useContext } from 'react';
import { Container, Typography, Card } from '../../atoms';
import { Button } from '../../molecules';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaSearch, FaUsers, FaCheckCircle, FaEye, FaMapMarkerAlt } from 'react-icons/fa';

const InvestigationPhase = ({
    scenario,
    discoveredIndices,
    onDiscoverIndice,
    isComplete,
    onNextPhase
}) => {
    const { nightMode } = useContext(NightModeContext);

    // Styles adaptatifs
    const cardBg = nightMode ? "#2d2d2d" : "white";
    const titleColor = nightMode ? "#28a745" : "#28a745"; // Garder le vert
    const textColor = nightMode ? "#ccc" : "black";

    return (
        <Card.PhaseCard
            borderColor="#28a745"
            style={{ backgroundColor: cardBg }}
        >
            <Typography.SubTitle style={{
                marginBottom: "1.5rem",
                color: titleColor
            }}>
                <FaSearch style={{ marginRight: "0.5rem" }} />
                Phase d'Investigation
            </Typography.SubTitle>

            <Typography.Paragraph style={{
                marginBottom: "2rem",
                color: textColor
            }}>
                Examinez la scène de crime et collectez des preuves. Vous devez découvrir au moins 3 indices avant de
                pouvoir passer aux interrogatoires.
            </Typography.Paragraph>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1rem",
                    marginBottom: "2rem",
                }}
            >
                {scenario.indices?.map((indice, index) => {
                    const isDiscovered = discoveredIndices.find((d) => d.numero === indice.numero);

                    return (
                        <Container.Base
                            key={index}
                            onClick={() => onDiscoverIndice(indice)}
                            style={{
                                backgroundColor: isDiscovered
                                    ? (nightMode ? "#1e3a2e" : "#d4edda")
                                    : (nightMode ? "#3d3d3d" : "#f8f9fa"),
                                padding: "1.5rem",
                                borderRadius: "8px",
                                border: nightMode ? "1px solid #555" : "1px solid #dee2e6",
                                cursor: "pointer",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    marginBottom: "0.5rem",
                                    color: isDiscovered
                                        ? (nightMode ? "#4ade80" : "#155724")
                                        : (nightMode ? "#ccc" : "#333"),
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {isDiscovered ? <FaCheckCircle /> : <FaEye />}
                                <span style={{ marginLeft: "0.5rem" }}>{indice.titre}</span>
                            </div>
                            {isDiscovered && (
                                <>
                                    <Typography.Paragraph style={{
                                        margin: "0.5rem 0",
                                        fontSize: "0.9rem",
                                        color: nightMode ? "#ccc" : "black"
                                    }}>
                                        {indice.description}
                                    </Typography.Paragraph>
                                    <div
                                        style={{
                                            fontSize: "0.8rem",
                                            color: nightMode ? "#aaa" : "#666",
                                            fontStyle: "italic",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <FaMapMarkerAlt style={{ marginRight: "0.3rem" }} />
                                        {indice.lieu}
                                    </div>
                                </>
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
                    Preuves collectées: {discoveredIndices.length}/{scenario.indices?.length || 0}
                </Typography.Paragraph>
                {isComplete && (
                    <Button.GameButton callBack={onNextPhase} bgColor="#ffc107" textColor="black">
                        <FaUsers style={{ marginRight: "0.5rem" }} />
                        Passer aux Interrogatoires
                    </Button.GameButton>
                )}
            </div>
        </Card.PhaseCard>
    );
};

export default InvestigationPhase;
