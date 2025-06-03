import { styled } from "styled-components";

const Title = styled.h1`
  color: ${({ theme }) =>
        theme?.typography?.title ?? theme?.default?.color ?? "black"};
`;

export default Title;
