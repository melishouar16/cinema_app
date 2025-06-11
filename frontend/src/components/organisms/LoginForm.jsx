import React, { useState } from "react";
import { Container, Typography } from "../atoms";
import { Button } from "../molecules";
import { useAuth } from "../../contexts/AuthContext";

const LoginForm = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(username, password);
        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <Container.Base style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
            <Typography.Title>Connexion</Typography.Title>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                    required
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                    required
                />

                {error && (
                    <Typography.Paragraph style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </Typography.Paragraph>
                )}

                <button
                    type="submit"
                    style={{
                        backgroundColor: '#4A90E2',
                        color: 'white',
                        padding: '0.75rem',
                        width: '100%',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Se connecter
                </button>
            </form>
        </Container.Base>
    );
};

export default LoginForm;
