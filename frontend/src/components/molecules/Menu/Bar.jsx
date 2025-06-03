import React from 'react';
import { Container } from '../../atoms';

const Bar = ({ children }) => {
    return <Container.Flex>{children}</Container.Flex>;
};

export default Bar;
