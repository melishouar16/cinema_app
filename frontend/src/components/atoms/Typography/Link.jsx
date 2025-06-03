import { styled } from "styled-components";

const Link = styled.a`
  color: ${({ theme }) => {
        return theme.typography.link ?? theme.default.activable ?? "blue";
    }};
  cursor: pointer;
`;

export default Link;
