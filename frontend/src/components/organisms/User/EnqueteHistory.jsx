import React, { useContext } from 'react';
import { Container, Typography } from '../../atoms';
import { Button } from '../../molecules';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaGamepad } from 'react-icons/fa';

const EnqueteHistory = ({ enquetes, onContinueEnquete }) => {
    const { nightMode } = useContext(NightModeContext);

    const containerStyle = {
        backgroundColor: nightMode ? '#2c3e50' : 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: nightMode
            ? '0 4px 15px rgba(0,0,0,0.3)'
            : '0 4px 15px rgba(0,0,0,0.1)'
    };

    const enqueteItemStyle = {
        backgroundColor: nightMode ? '#34495e' : 'white',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '0.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: nightMode
            ? '0 2px 8px rgba(0,0,0,0.2)'
            : '0 2px 8px rgba(0,0,0,0.1)'
    };

    const getStatutColor = (statut) => {
        switch (statut) {
            case 'terminee': return '#27AE60';
            case 'en_cours': return '#F39C12';
            case 'abandonnee': return '#E74C3C';
            default: return '#95A5A6';
        }
    };

    const getStatutLabel = (statut) => {
        switch (statut) {
            case 'terminee': return 'Terminée';
            case 'en_cours': return 'En cours';
            case 'abandonnee': return 'Abandonnée';
            default: return 'Inconnue';
        }
    };

    return (
        <Container.Base style={containerStyle}>
            <Typography.Title style={{
                color: '#3498db',
                marginBottom: '1rem',
                fontSize: '1.3rem'
            }}>
                <FaGamepad style={{ marginRight: '0.5rem' }} />
                Enquêtes récentes
            </Typography.Title>

            {enquetes && enquetes.length > 0 ? (
                enquetes.map((enquete, index) => (
                    <div key={index} style={enqueteItemStyle}>
                        <div>
                            <Typography.Paragraph style={{
                                margin: '0',
                                fontWeight: 'bold',
                                color: nightMode ? '#ecf0f1' : '#2c3e50'
                            }}>
                                {enquete.titre}
                            </Typography.Paragraph>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {enquete.progression && (
                                <div style={{
                                    fontSize: '0.9rem',
                                    color: '#f39c12'
                                }}>
                                    {enquete.progression}%
                                </div>
                            )}
                            <span style={{
                                background: getStatutColor(enquete.statut),
                                color: 'white',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}>
                                {getStatutLabel(enquete.statut)}
                            </span>
                            {enquete.statut === 'en_cours' && (
                                <Button.Default
                                    callBack={() => onContinueEnquete(enquete.id)}
                                    style={{
                                        fontSize: '0.8rem',
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '12px'
                                    }}
                                >
                                    Continuer
                                </Button.Default>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <Typography.Paragraph style={{
                    textAlign: 'center',
                    color: '#7f8c8d',
                    fontStyle: 'italic'
                }}>
                    Aucune enquête jouée pour le moment
                </Typography.Paragraph>
            )}
        </Container.Base>
    );
};

export default EnqueteHistory;
