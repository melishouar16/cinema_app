import { styled } from "styled-components";

const Flex = styled.div`
  display: flex;
  width: 100vw;
  justify-content: space-around;
  background-color: ${({ theme, bgColor }) => {
        return bgColor ?? theme.container.primary ?? theme.bgColor ?? "white";
    }};
`;

export default Flex;
