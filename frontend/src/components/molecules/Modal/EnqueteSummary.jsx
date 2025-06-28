import React, { useContext } from 'react';
import { Typography } from '../../atoms';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaTimes, FaFilm, FaMapMarkerAlt } from 'react-icons/fa';

const EnqueteSummary = ({ enquete, scenario, isVisible, onClose, onPlay }) => {
    const { nightMode } = useContext(NightModeContext);

    if (!isVisible) return null;

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
    };

    const modalStyle = {
        backgroundColor: nightMode ? '#2d2d2d' : 'white',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative',
        border: nightMode ? '1px solid #444' : '1px solid #ddd'
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Bouton fermer */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        color: nightMode ? '#ccc' : '#666',
                        cursor: 'pointer'
                    }}
                >
                    <FaTimes />
                </button>

                {/* Titre */}
                <Typography.Title style={{
                    color: nightMode ? 'white' : 'black',
                    marginBottom: '1rem'
                }}>
                    {enquete.titre}
                </Typography.Title>

                {/* Film source */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    color: nightMode ? '#ccc' : '#666'
                }}>
                    <FaFilm style={{ marginRight: '0.5rem' }} />
                    <Typography.Paragraph style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        color: nightMode ? '#ccc' : '#666'
                    }}>
                        Inspiré du film "{enquete.film_source_titre}"
                    </Typography.Paragraph>
                </div>

                {/* Contexte */}
                {scenario?.contexte && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                        }}>
                            <FaMapMarkerAlt style={{
                                marginRight: '0.5rem',
                                color: '#4A90E2'
                            }} />
                            <Typography.SubTitle style={{
                                color: nightMode ? 'white' : 'black',
                                margin: 0,
                                fontSize: '1.1rem'
                            }}>
                                Contexte
                            </Typography.SubTitle>
                        </div>
                        <Typography.Paragraph style={{
                            color: nightMode ? '#ccc' : '#666',
                            lineHeight: '1.6',
                            marginLeft: '1.5rem'
                        }}>
                            {scenario.contexte}
                        </Typography.Paragraph>
                    </div>
                )}

                {/* Crime */}
                {scenario?.crime && (
                    <div style={{
                        marginBottom: '2rem',
                        backgroundColor: nightMode ? '#3d2914' : '#fff3cd',
                        border: `1px solid ${nightMode ? '#664d03' : '#ffeaa7'}`,
                        borderRadius: '6px',
                        padding: '1rem'
                    }}>
                        <Typography.SubTitle style={{
                            color: nightMode ? '#ffca2c' : '#856404',
                            margin: '0 0 0.5rem 0',
                            fontSize: '1.1rem'
                        }}>
                            🔍 Le Crime
                        </Typography.SubTitle>
                        <Typography.Paragraph style={{
                            color: nightMode ? '#f1c40f' : '#856404',
                            margin: 0,
                            lineHeight: '1.6'
                        }}>
                            {scenario.crime}
                        </Typography.Paragraph>
                    </div>
                )}

                {/* Évaluation */}
                <div style={{ marginBottom: '2rem' }}>
                    <Typography.SubTitle style={{
                        color: nightMode ? 'white' : 'black',
                        fontSize: '1rem',
                        marginBottom: '0.5rem'
                    }}>
                        Évaluation de la communauté
                    </Typography.SubTitle>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#ffc107', fontSize: '1.2rem', marginRight: '0.5rem' }}>
                            {'★'.repeat(Math.round(enquete.evaluation_moyenne || 0))}
                            {'☆'.repeat(5 - Math.round(enquete.evaluation_moyenne || 0))}
                        </span>
                        <Typography.Paragraph style={{
                            color: nightMode ? '#ccc' : '#666',
                            fontSize: '0.9rem',
                            margin: 0
                        }}>
                            {(enquete.evaluation_moyenne || 0).toFixed(1)} ({enquete.nombre_evaluations || 0} avis)
                        </Typography.Paragraph>
                    </div>
                </div>

                {/* Informations supplémentaires */}
                <div style={{
                    marginBottom: '2rem',
                    fontSize: '0.85rem',
                    color: nightMode ? '#aaa' : '#888'
                }}>
                    Créée par <strong>{enquete.createur_nom}</strong> •
                    {scenario?.suspects?.length || 0} suspects •
                    {scenario?.indices?.length || 0} indices
                </div>

                {/* Boutons d'action */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onPlay}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            flex: 1
                        }}
                    >
                        🎮 Jouer cette enquête
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: 'transparent',
                            color: nightMode ? '#ccc' : '#666',
                            border: `1px solid ${nightMode ? '#444' : '#ddd'}`,
                            padding: '0.75rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnqueteSummary;
