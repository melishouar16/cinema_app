import React from "react";
import { Container, Typography } from "../../atoms";

const Tab = ({ callBack, children }) => {
    return (
        <Container.Base onClick={callBack}>
            <Typography.Link>{children}</Typography.Link>
        </Container.Base>
    );
};

export default Tab;
