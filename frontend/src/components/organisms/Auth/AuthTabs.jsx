import React, { useState, useContext } from 'react';
import { Container } from '../../atoms';
import { Button } from '../../molecules';
import { LoginForm, RegisterForm } from './';
import { NightModeContext } from '../../../contexts/NightModeContext';

const AuthTabs = () => {
    const { nightMode } = useContext(NightModeContext);
    const [activeTab, setActiveTab] = useState('login');

    const tabContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
        borderBottom: `1px solid ${nightMode ? '#34495e' : '#ddd'}`
    };

    return (
        <Container.Base>
            <div style={tabContainerStyle}>
                <Button.TabButton
                    active={activeTab === 'login'}
                    onClick={() => setActiveTab('login')}
                    activeColor="#4A90E2"
                >
                    Connexion
                </Button.TabButton>
                <Button.TabButton
                    active={activeTab === 'register'}
                    onClick={() => setActiveTab('register')}
                    activeColor="#2ECC71"
                >
                    Inscription
                </Button.TabButton>
            </div>

            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </Container.Base>
    );
};

export default AuthTabs;
