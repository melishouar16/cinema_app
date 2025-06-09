import React from "react";
import { Container, Typography } from "../atoms";
import { Button, LoginForm } from "../molecules";
import { useAuth } from "../../contexts/AuthContext";

const Auth = () => {
    const { isAuthenticated, user, logout } = useAuth();

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

    // Si pas connecté, afficher le formulaire
    return (
        <Container.Base>
            <LoginForm />
        </Container.Base>
    );
};

export default Auth;
