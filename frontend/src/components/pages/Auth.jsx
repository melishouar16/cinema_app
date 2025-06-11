import React, { useState } from "react";
import { Container, Typography } from "../atoms";
import { Button } from "../molecules";
import { LoginForm, RegisterForm } from '../organisms';
import { useAuth } from "../../contexts/AuthContext";

const Auth = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('login'); // État pour gérer les onglets

    // Si connecté, afficher le profil
    if (isAuthenticated) {
        return (
            <Container.Base style={{ padding: '2rem', textAlign: 'center' }}>
                <Typography.Title>
                    Bonjour {user?.first_name || user?.username} !
                </Typography.Title>
                <Typography.Paragraph>Email: {user?.email}</Typography.Paragraph>
                <Typography.Paragraph>
                    Rôle: {user?.profile?.role || 'Utilisateur'}
                </Typography.Paragraph>

                <Button.Default
                    callBack={logout}
                    style={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    Se déconnecter
                </Button.Default>
            </Container.Base>
        );
    }

    // si pas connecté, afficher les formulaire avec onglets (inscription/ connexion)
    return (
        <Container.Base>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '2rem',
                borderBottom: '1px solid #ddd'
            }}>
                <button
                    onClick={() => setActiveTab('login')}
                    style={{
                        padding: '1rem 2rem',
                        border: 'none',
                        backgroundColor: activeTab === 'login' ? '#4A90E2' : 'transparent',
                        color: activeTab === 'login' ? 'white' : '#333',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'login' ? '2px solid #4A90E2' : 'none'
                    }}
                >
                    Connexion
                </button>
                <button
                    onClick={() => setActiveTab('register')}
                    style={{
                        padding: '1rem 2rem',
                        border: 'none',
                        backgroundColor: activeTab === 'register' ? '#2ECC71' : 'transparent',
                        color: activeTab === 'register' ? 'white' : '#333',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'register' ? '2px solid #2ECC71' : 'none'
                    }}
                >
                    Inscription
                </button>
            </div>

            {/* Contenu selon l'onglet actif */}
            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </Container.Base>
    );
};

export default Auth;
