import React, { useContext } from 'react';
import { Container, Typography } from '../../atoms';
import { ScoreDisplay } from '../../atoms/Score';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { scoringService } from '../../../services/scoringService';
import { FaClipboardList, FaComments, FaCheckCircle, FaTimes, FaSearch } from 'react-icons/fa';

const FinalScore = ({ scoreInfo, stats, hasWon, onBackToHome, scenario }) => {
    const { nightMode } = useContext(NightModeContext);

    return (
        <Container.Base style={{
            background: nightMode ? '#2a2a2a' : '#f8f9fa',
            padding: '30px',
            borderRadius: '15px',
            margin: '20px 0',
            border: `3px solid ${scoreInfo.color}`,
            textAlign: 'center'
        }}>
            <Typography.Title style={{
                marginBottom: '20px',
                color: nightMode ? 'white' : 'black'
            }}>
                Enquête Terminée !
            </Typography.Title>

            <ScoreDisplay {...scoreInfo} size="large" />

            <Container.Flex style={{
                justifyContent: 'space-around',
                margin: '20px 0',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '1.5rem',
                        color: nightMode ? '#06B6D4' : '#007bff',
                        marginBottom: '5px'
                    }}>
                        <FaClipboardList />
                    </div>
                    <Typography.Paragraph style={{ color: nightMode ? 'white' : 'black' }}>
                        Indices: {stats.indices}
                    </Typography.Paragraph>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '1.5rem',
                        color: nightMode ? '#F59E0B' : '#ffc107',
                        marginBottom: '5px'
                    }}>
                        <FaComments />
                    </div>
                    <Typography.Paragraph style={{ color: nightMode ? 'white' : 'black' }}>
                        Questions: {stats.interrogatoires}
                    </Typography.Paragraph>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '1.5rem',
                        color: hasWon ? '#10B981' : '#EF4444',
                        marginBottom: '5px'
                    }}>
                        {hasWon ? <FaCheckCircle /> : <FaTimes />}
                    </div>
                    <Typography.Paragraph style={{ color: nightMode ? 'white' : 'black' }}>
                        {hasWon ? 'Résolu !' : 'Échec'}
                    </Typography.Paragraph>
                </div>
            </Container.Flex>

            {/* NOUVELLE SECTION - Indices clés */}
            {scenario?.solution?.indices_cles && (
                <Container.Base style={{
                    background: nightMode ? '#3d3d3d' : 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    margin: '25px 0',
                    textAlign: 'left',
                    border: `1px solid ${nightMode ? '#555' : '#ddd'}`
                }}>
                    <Typography.SubTitle style={{
                        color: nightMode ? '#4ade80' : '#155724',
                        marginBottom: '15px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <FaSearch />
                        Indices clés de l'enquête
                    </Typography.SubTitle>

                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        color: nightMode ? '#ccc' : 'black'
                    }}>
                        {scenario.solution.indices_cles.map((indice, index) => (
                            <li key={index} style={{
                                marginBottom: '10px',
                                paddingLeft: '20px',
                                position: 'relative',
                                lineHeight: '1.4'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '0',
                                    color: '#4A90E2',
                                    fontSize: '1.2rem'
                                }}>•</span>
                                {indice}
                            </li>
                        ))}
                    </ul>
                </Container.Base>
            )}

            <Container.Base style={{
                background: nightMode ? '#1a1a1a' : '#e9ecef',
                padding: '15px',
                borderRadius: '8px',
                margin: '20px 0'
            }}>
                <Typography.Paragraph style={{ color: nightMode ? '#ccc' : '#666' }}>
                    {scoringService.getMessage(scoreInfo.score)}
                </Typography.Paragraph>
            </Container.Base>

            <button
                onClick={onBackToHome}
                style={{
                    padding: '12px 25px',
                    borderRadius: '8px',
                    border: `2px solid ${scoreInfo.color}`,
                    background: scoreInfo.color,
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                }}
            >
                Retour à l'accueil
            </button>
        </Container.Base>
    );
};

export default FinalScore;
