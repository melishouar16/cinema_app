import { styled } from "styled-components";

const SubTitle = styled.h2`
  color: ${({ theme }) => {
        return theme?.typography?.subTitle ?? theme?.default?.color ?? "black";
    }};
`;

export default SubTitle;
