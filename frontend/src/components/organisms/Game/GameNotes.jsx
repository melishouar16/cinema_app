
import React, { useContext } from 'react';
import { Typography, Card } from '../../atoms';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaStickyNote } from 'react-icons/fa';

const GameNotes = ({ playerNotes, setPlayerNotes }) => {
    const { nightMode } = useContext(NightModeContext);

    // adapter au night mode
    const cardBg = nightMode ? "#2d2d2d" : "#f8f9fa";
    const titleColor = nightMode ? "white" : "black";
    const textareaBg = nightMode ? "#3d3d3d" : "white";
    const textareaColor = nightMode ? "white" : "black";
    const borderColor = nightMode ? "#555" : "#ced4da";

    return (
        <Card.PhaseCard style={{ backgroundColor: cardBg }}>
            <Typography.SubTitle style={{
                marginBottom: "1rem",
                color: titleColor
            }}>
                <FaStickyNote style={{ marginRight: "0.5rem" }} />
                Notes du détective
            </Typography.SubTitle>
            <textarea
                value={playerNotes}
                onChange={(e) => setPlayerNotes(e.target.value)}
                placeholder="Notez vos observations, théories, et déductions..."
                style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "1rem",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                    resize: "vertical",
                    backgroundColor: textareaBg,
                    color: textareaColor
                }}
            />
        </Card.PhaseCard>
    );
};

export default GameNotes;
