import React, { useState, useContext } from 'react';
import { Typography } from '../../atoms';
import { Button } from '../Button';
import { NightModeContext } from '../../../contexts/NightModeContext';

const Form = ({ onSubmit, enqueteId }) => {
    const [selectedNote, setSelectedNote] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const { nightMode } = useContext(NightModeContext);

    const handleSubmit = async () => {
        if (selectedNote === 0) {
            alert('Veuillez sélectionner une note');
            return;
        }

        try {
            await onSubmit(selectedNote);
            setSubmitted(true);
        } catch (error) {
            alert(error.message || 'Erreur lors de l\'évaluation');
        }
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Typography.SubTitle style={{ color: nightMode ? 'white' : 'black' }}>
                    Merci pour votre évaluation ! ⭐
                </Typography.SubTitle>
            </div>
        );
    }

    return (
        <div style={{
            textAlign: 'center',
            padding: '2rem',
            border: `1px solid ${nightMode ? '#444' : '#ddd'}`,
            borderRadius: '8px',
            marginTop: '2rem',
            backgroundColor: nightMode ? '#2d2d2d' : '#f8f9fa'
        }}>
            <Typography.SubTitle style={{ color: nightMode ? 'white' : 'black' }}>
                Évaluez cette enquête
            </Typography.SubTitle>

            <div style={{ margin: '1rem 0' }}>
                {[1, 2, 3, 4, 5].map(note => (
                    <button
                        key={note}
                        onClick={() => setSelectedNote(note)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '2rem',
                            color: note <= selectedNote ? '#ffc107' : '#ccc',
                            cursor: 'pointer',
                            margin: '0 0.2rem'
                        }}
                    >
                        ★
                    </button>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                style={{
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                }}
            >
                Envoyer l'évaluation
            </button>
        </div>
    );
};

export default Form;
