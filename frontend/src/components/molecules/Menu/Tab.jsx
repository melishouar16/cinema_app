import React from "react";
import { Container, Typography } from "../../atoms";

const Tab = ({ callBack, children, active = false, icon }) => {
    return (
        <Container.Base
            onClick={callBack}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: active ? '#4A90E2' : 'transparent',
                color: active ? 'white' : 'inherit',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
        >
            {icon && <span style={{ fontSize: '1.1rem' }}>{icon}</span>}
            <Typography.Paragraph>
                {children}
            </Typography.Paragraph>
        </Container.Base>
    );
};

export default Tab;
