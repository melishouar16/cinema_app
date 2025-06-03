import { styled } from "styled-components";

const Paragraph = styled.p`
  color: ${({ color, theme }) => {
        return (
            color ?? theme?.typography?.paragraph ?? theme?.default?.color ?? "black"
        );
    }};
`;

export default Paragraph;
