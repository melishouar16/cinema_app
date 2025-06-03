import React from "react";
import { Container, Typography } from "../../atoms";

const Default = ({ callBack, children, ...props }) => {
    return (
        <Container.Base onClick={callBack}>
            <Typography.Paragraph {...props}>
                {children}
            </Typography.Paragraph>
        </Container.Base>
    );
};

export default Default;
