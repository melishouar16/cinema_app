import React from 'react';
import { Alerte } from '../';

const GameAlert = ({ showAlert, alertMessage, alertType, onClose }) => (
    /* Alerte personnalisée */
    <Alerte.CustomAlert
        isVisible={showAlert}
        message={alertMessage}
        type={alertType}
        onClose={onClose}
    />
);

export default GameAlert;
