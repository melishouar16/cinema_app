import React, { useContext } from 'react';
import { Container, Typography } from '../../atoms';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const CustomAlert = ({ isVisible, message, onClose, type = "error" }) => {
    const { nightMode } = useContext(NightModeContext);

    if (!isVisible) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000
        }}>
            <Container.Base style={{
                backgroundColor: nightMode ? "#2d2d2d" : "white",
                border: `2px solid #dc3545`,
                borderRadius: "10px",
                padding: "2rem",
                maxWidth: "400px",
                width: "90%",
                textAlign: "center",
                boxShadow: nightMode
                    ? "0 10px 30px rgba(0,0,0,0.5)"
                    : "0 10px 30px rgba(0,0,0,0.3)",
                position: "relative"
            }}>
                {/* Bouton de fermeture */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        background: "none",
                        border: "none",
                        color: nightMode ? "#ccc" : "#666",
                        fontSize: "1.2rem",
                        cursor: "pointer"
                    }}
                >
                    <FaTimes />
                </button>

                {/* Icône d'erreur */}
                <div style={{
                    fontSize: "2.5rem",
                    color: "#dc3545",
                    marginBottom: "1rem"
                }}>
                    <FaExclamationTriangle />
                </div>

                {/* Message */}
                <Typography.Title style={{
                    color: nightMode ? "white" : "black",
                    marginBottom: "1.5rem",
                    fontSize: "1.1rem"
                }}>
                    {message}
                </Typography.Title>

                {/* Bouton OK */}
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.8rem 2rem",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    OK
                </button>
            </Container.Base>
        </div>
    );
};

export default CustomAlert;
