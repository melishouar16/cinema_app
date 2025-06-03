import React, { useContext } from "react";
import { Container, Typography } from "../../atoms";
import { NightModeContext } from "../../../contexts/NightModeContext";
import { FaSun, FaMoon } from 'react-icons/fa';

const ToggleNight = () => {
    const nightContext = useContext(NightModeContext);

    return (
        <Container.Base
            onClick={nightContext.switchNightMode}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: '1px solid currentColor',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
        >
            <span style={{ fontSize: '1.1rem' }}>
                {nightContext.nightMode ? <FaSun /> : <FaMoon />}
            </span>
            <Typography.Paragraph>
                {nightContext.nightMode ? 'Mode jour' : 'Mode nuit'}
            </Typography.Paragraph>
        </Container.Base>
    );
};

export default ToggleNight;
