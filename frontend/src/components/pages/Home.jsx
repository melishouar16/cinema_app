import React, { useState, useEffect, useContext } from "react";
import { Container, Typography } from "../atoms";
import { useAuth } from "../../contexts/AuthContext";
import { NightModeContext } from "../../contexts/NightModeContext"; // Ajouter import night mode
import enqueteService from "../../services/enqueteService";

const Home = ({ onNavigate }) => {
    const { isAuthenticated } = useAuth();
    const { nightMode } = useContext(NightModeContext); // Ajouter night mode context
    const [enquetes, setEnquetes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEnquetes = async () => {
            try {
                const data = await enqueteService.getAll();
                setEnquetes(data.results || data);
            } catch (err) {
                console.error('Erreur:', err);
            } finally {
                setLoading(false);
            }
        };
        loadEnquetes();
    }, []);

    const handlePlay = (enqueteId) => {
        if (!isAuthenticated) {
            alert('Connectez-vous pour jouer !');
            return;
        }

        // Naviguer vers la page PlayEnquete avec l'ID de l'enquête
        console.log('Navigation vers PlayEnquete avec enquête ID:', enqueteId);

        // Optionnel : Stocker l'ID de l'enquête dans le localStorage pour la récupérer dans PlayEnquete
        localStorage.setItem('currentEnqueteId', enqueteId);

        // Naviguer vers la page play
        if (onNavigate) {
            onNavigate('play');
        }
    };

    const handleDetails = (enqueteId) => {
        // Fonction pour afficher les détails (à implémenter plus tard)
        console.log('Afficher détails enquête:', enqueteId);
    };

    if (loading) {
        return (
            <Container.Base style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: nightMode ? "#1a1a1a" : "white", // Night mode
                color: nightMode ? "white" : "black", // Night mode
                minHeight: "100vh" // Night mode
            }}>
                <Typography.Title style={{ color: nightMode ? "white" : "black" }}>
                    Chargement...
                </Typography.Title>
            </Container.Base>
        );
    }

    return (
        <Container.Base style={{
            padding: '2rem',
            backgroundColor: nightMode ? "#1a1a1a" : "white", // Night mode
            color: nightMode ? "white" : "black", // Night mode
            minHeight: "100vh" // Night mode
        }}>
            <Typography.Title style={{ color: nightMode ? "white" : "black" }}>
                Enquêtes Policières
            </Typography.Title>

            <Typography.Paragraph style={{
                color: nightMode ? "#ccc" : '#666', // Night mode
                marginBottom: '2rem'
            }}>
                Découvrez des enquêtes générées par IA basées sur vos films préférés
            </Typography.Paragraph>

            {!isAuthenticated && (
                <div style={{
                    backgroundColor: nightMode ? "#1e3a5f" : '#e8f4fd', // Night mode
                    color: nightMode ? "#87ceeb" : "black", // Night mode
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <strong>Connectez-vous pour jouer aux enquêtes !</strong>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
            }}>
                {enquetes.map(enquete => (
                    <div
                        key={enquete.id}
                        style={{
                            border: nightMode ? "1px solid #444" : '1px solid #ddd', // Night mode
                            borderRadius: '8px',
                            padding: '1.5rem',
                            backgroundColor: nightMode ? "#2d2d2d" : 'white', // Night mode
                            boxShadow: nightMode ? "0 2px 4px rgba(0,0,0,0.3)" : '0 2px 4px rgba(0,0,0,0.1)' // Night mode
                        }}
                    >
                        <Typography.SubTitle style={{
                            marginBottom: '1rem',
                            color: nightMode ? "white" : "black" // Night mode
                        }}>
                            {enquete.titre}
                        </Typography.SubTitle>

                        {enquete.description !== "Enquête générée par IA" && (
                            <Typography.Paragraph style={{
                                color: nightMode ? "#ccc" : '#666', // Night mode
                                marginBottom: '1rem',
                                fontSize: '0.9rem'
                            }}>
                                {enquete.description}
                            </Typography.Paragraph>
                        )}

                        <div style={{
                            fontSize: '0.85rem',
                            color: nightMode ? "#aaa" : '#888', // Night mode
                            marginBottom: '1.5rem'
                        }}>
                            Créée par <strong>{enquete.createur_nom}</strong>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => handlePlay(enquete.id)}
                                style={{
                                    backgroundColor: isAuthenticated ? '#28a745' : '#6c757d',
                                    color: 'white',
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                                    fontSize: '0.9rem',
                                    flex: 1
                                }}
                                disabled={!isAuthenticated}
                            >
                                {isAuthenticated ? 'Jouer' : 'Se connecter'}
                            </button>

                            <button
                                onClick={() => handleDetails(enquete.id)}
                                style={{
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Détails
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {enquetes.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    backgroundColor: nightMode ? "#2d2d2d" : '#f8f9fa', // Night mode
                    borderRadius: '8px',
                    marginTop: '2rem'
                }}>
                    <Typography.SubTitle style={{ color: nightMode ? "white" : "black" }}>
                        Aucune enquête disponible
                    </Typography.SubTitle>
                    <Typography.Paragraph style={{ color: nightMode ? "#ccc" : '#666' }}>
                        Soyez le premier à créer une enquête !
                    </Typography.Paragraph>
                </div>
            )}
        </Container.Base>
    );
};

export default Home;
