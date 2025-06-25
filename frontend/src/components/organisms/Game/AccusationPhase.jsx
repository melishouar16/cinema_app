
import React, { useContext } from 'react';
import { Typography, Card } from '../../atoms';
import { Button } from '../../molecules';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaGavel, FaUser } from 'react-icons/fa';

const AccusationPhase = ({ scenario, onMakeAccusation }) => {
    const { nightMode } = useContext(NightModeContext);

    // adapter selon night mode
    const cardBg = nightMode ? "#2d2d2d" : "white";
    const titleColor = nightMode ? "#dc3545" : "#dc3545"; // Garder le rouge
    const textColor = nightMode ? "#ccc" : "black";

    return (
        <Card.PhaseCard
            borderColor="#dc3545"
            style={{ backgroundColor: cardBg }}
        >
            <Typography.SubTitle style={{
                textAlign: "center",
                marginBottom: "2rem",
                color: titleColor
            }}>
                <FaGavel style={{ marginRight: "0.5rem" }} />
                Qui est le coupable ?
            </Typography.SubTitle>

            <Typography.Paragraph
                style={{
                    textAlign: "center",
                    marginBottom: "2rem",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: textColor
                }}
            >
                Basez-vous sur les preuves collectées et les interrogatoires menés. Une seule chance !
            </Typography.Paragraph>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1rem",
                }}
            >
                {scenario.suspects?.map((suspect, index) => (
                    <Button.GameButton
                        key={index}
                        callBack={() => onMakeAccusation(suspect.nom)}
                        bgColor={nightMode ? "#3d3d3d" : "white"}
                        textColor={nightMode ? "white" : "black"}
                        style={{
                            border: `2px solid #dc3545`,
                            padding: "2rem",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            backgroundColor: nightMode ? "#3d3d3d" : "white"
                        }}
                    >
                        <FaUser style={{ marginRight: "0.5rem" }} />
                        {suspect.nom}
                    </Button.GameButton>
                ))}
            </div>
        </Card.PhaseCard>
    );
};

export default AccusationPhase;
