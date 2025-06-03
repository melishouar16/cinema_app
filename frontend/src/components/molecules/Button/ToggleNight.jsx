import React, { useContext, useState } from "react";
import { Container, Typography } from "../../atoms";
import { NightModeContext } from "../../../contexts/NightModeContext";

const ToggleNight = ({ ...props }) => {
    const primary = "white";
    const secondary = "black";
    const [isOn, setIsOn] = useState(true);
    const nightContext = useContext(NightModeContext);

    return (
        <Container.Base bg={isOn ? secondary : primary}>
            <Typography.Paragraph
                onClick={() => {
                    nightContext.switchNightMode();
                    setIsOn(!isOn);
                }}
                color={isOn ? primary : secondary}
                {...props}
            >
                {nightContext.nightMode ? "Passer en Day mode" : "Passer en Night mode"}
            </Typography.Paragraph>
        </Container.Base>
    );
};

export default ToggleNight;
