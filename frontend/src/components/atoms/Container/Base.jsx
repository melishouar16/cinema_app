import React from "react";
import { styled } from "styled-components";

const Base = styled.div`
  background-color: ${(props) => {
        return props.bg ?? props.theme.bgColor;
    }};
  color: ${(props) => {
        return props.color ?? props.theme.color;
    }};
`;

export default Base;
