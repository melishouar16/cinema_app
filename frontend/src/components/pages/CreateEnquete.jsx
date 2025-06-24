// frontend/src/components/pages/CreateEnquete.jsx
import React, { useState } from "react";
import { Container, Typography } from "../atoms";
import { useAuth } from "../../contexts/AuthContext";
import filmService from "../../services/filmService";
import enqueteService from "../../services/enqueteService";

const CreateEnquete = () => {
    const { isAuthenticated } = useAuth();
    const [filmTitre, setFilmTitre] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!filmTitre.trim()) {
            setMessage('Le nom du film est obligatoire');
            return;
        }

        try {
            setLoading(true);
            setMessage(' L\'IA recherche les infos du film...');

            // 1. L'IA génère le scénario complet
            const aiResponse = await fetch('http://localhost:8000/api/test-ai/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    titre: filmTitre.trim()
                })
            });


            const aiData = await aiResponse.json();

            if (aiData.error) {
                setMessage(` ${aiData.message}`);
                return;
            }

            // DEBUG: Vérifier ce que l'IA retourne
            console.log('Données IA reçues:', aiData);
            console.log('Auteur IA:', aiData.auteur);

            setMessage(' Film trouvé ! Création en cours...');

            // 2. Créer l'auteur
            const auteurNom = aiData.auteur || `Réalisateur de ${filmTitre}`;
            const auteurData = {
                nom: auteurNom,
                email: `${auteurNom.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}@cinema.com`,
                date_naissance: '1970-01-01'
            };

            let auteurId = 1; // Fallback
            try {
                const auteurResponse = await fetch('http://localhost:8000/api/auteurs/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(auteurData)
                });

                if (auteurResponse.ok) {
                    const newAuteur = await auteurResponse.json();
                    auteurId = newAuteur.id;
                } else {
                    // Chercher l'auteur existant
                    const auteursResponse = await fetch('http://localhost:8000/api/auteurs/', {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`
                        }
                    });

                    if (auteursResponse.ok) {
                        const auteursData = await auteursResponse.json();
                        const auteurs = auteursData.results || auteursData;
                        const auteurExistant = auteurs.find(a =>
                            a.nom.toLowerCase().includes(auteurNom.toLowerCase())
                        );

                        if (auteurExistant) {
                            auteurId = auteurExistant.id;
                        }
                    }
                }
            } catch (error) {
                console.log('Erreur auteur, utilisation fallback ID=1');
            }

            // 3. Créer le film
            const filmData = {
                titre: aiData.titre || filmTitre.trim(),
                auteur: auteurId,
                description: aiData.description || `Film : ${filmTitre}`,
                date_sortie: new Date().toISOString().split('T')[0],
                evaluation: 3,
                statut: 'publie'
            };

            const newFilm = await filmService.create(filmData);

            // 4. Créer l'enquête
            const enqueteData = {
                titre: aiData.titre || `Enquête - ${filmTitre}`,
                description: `Enquête générée par IA`,
                film_source: newFilm.id,
                statut: 'publie',
                scenario_json: JSON.stringify(aiData)
            };

            const newEnquete = await enqueteService.create(enqueteData);
            setMessage(`Enquête "${newEnquete.titre}" créée avec succès ! 🎬`);
            setFilmTitre('');

        } catch (error) {
            setMessage(` ${error.message}`);
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Container.Base style={{ padding: '2rem', textAlign: 'center' }}>
                <Typography.Title>Connectez-vous pour créer une enquête</Typography.Title>
            </Container.Base>
        );
    }

    return (
        <Container.Base style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
            <Typography.Title>Créer une nouvelle enquête</Typography.Title>

            <Typography.Paragraph style={{ marginBottom: '2rem', color: '#666' }}>
                Sélectionnez un film et notre IA générera automatiquement une enquête policière
                basée sur son univers, ses personnages et son intrigue.
            </Typography.Paragraph>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Film source *
                    </label>
                    <input
                        type="text"
                        value={filmTitre}
                        onChange={(e) => setFilmTitre(e.target.value)}
                        placeholder="-- Sélectionnez un film --"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: '#f8f9fa'
                        }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        backgroundColor: loading ? '#ccc' : '#4A90E2',
                        color: 'white',
                        padding: '1rem 2rem',
                        width: '100%',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Création en cours...' : 'Créer l\'enquête avec l\'IA'}
                </button>
            </form>

            {message && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    borderRadius: '4px'
                }}>
                    {message}
                </div>
            )}
        </Container.Base>
    );
};

export default CreateEnquete;
