import React, { useState } from "react";
import { Container, Typography } from "../../atoms";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (formData.password !== formData.password_confirm) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(true);
                setFormData({
                    username: '', email: '', password: '', password_confirm: ''
                });
            } else {
                const errorData = await response.json();
                const firstKey = Object.keys(errorData)[0];
                const firstError = errorData[firstKey];
                setError(Array.isArray(firstError) ? firstError[0] : firstError);
            }
        } catch (error) {
            setError('Erreur de connexion');
        }
    };

    const inputStyle = {
        width: '100%', padding: '0.75rem', marginBottom: '1rem',
        border: '1px solid #ddd', borderRadius: '4px'
    };

    return (
        <Container.Base style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
            <Typography.Title>Inscription</Typography.Title>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <input
                    type="password"
                    name="password_confirm"
                    placeholder="Confirmer le mot de passe"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                {success && <Typography.Paragraph style={{ color: 'green', marginBottom: '1rem' }}>
                    Inscription réussie !
                </Typography.Paragraph>}

                {error && <Typography.Paragraph style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                </Typography.Paragraph>}

                <button type="submit" style={{
                    backgroundColor: '#2ECC71', color: 'white', padding: '0.75rem', width: '100%',
                    border: 'none', borderRadius: '4px', cursor: 'pointer'
                }}>
                    S'inscrire
                </button>
            </form>
        </Container.Base>
    );
};

export default RegisterForm;
