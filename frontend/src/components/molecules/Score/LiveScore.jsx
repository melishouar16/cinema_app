import React, { useContext } from 'react';
import { Container, Typography } from '../../atoms';
import { ScoreDisplay } from '../../atoms/Score';
import { NightModeContext } from '../../../contexts/NightModeContext';
import { FaClipboardList, FaComments, FaTimes } from 'react-icons/fa';

const LiveScore = ({ scoreInfo, stats }) => {
    const { nightMode } = useContext(NightModeContext);

    return (
        <Container.Base style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            background: nightMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderRadius: '10px',
            padding: '10px',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
            <ScoreDisplay {...scoreInfo} size="small" />

            <Container.Base style={{
                marginTop: '10px',
                fontSize: '0.8rem',
                color: nightMode ? '#ccc' : '#666'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '2px',
                    color: nightMode ? '#06B6D4' : '#007bff'
                }}>
                    <FaClipboardList style={{ marginRight: '5px' }} />
                    {stats.indices} indices
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '2px',
                    color: nightMode ? '#F59E0B' : '#ffc107'
                }}>
                    <FaComments style={{ marginRight: '5px' }} />
                    {stats.interrogatoires} questions
                </div>

                {stats.erreurs > 0 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#ff6b6b'
                    }}>
                        <FaTimes style={{ marginRight: '5px' }} />
                        {stats.erreurs} erreurs
                    </div>
                )}
            </Container.Base>
        </Container.Base>
    );
};

export default LiveScore;
