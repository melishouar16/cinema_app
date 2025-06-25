
import { useContext } from 'react';
import { NightModeContext } from '../../../contexts/NightModeContext';

const PhaseCard = ({ children, borderColor, style, ...props }) => {
    const { nightMode } = useContext(NightModeContext);

    const defaultStyle = {
        backgroundColor: nightMode ? "#2d2d2d" : "white",
        padding: "2rem",
        borderRadius: "12px",
        border: `2px solid ${borderColor || (nightMode ? "#555" : "#dee2e6")}`,
        marginBottom: "2rem",
        ...style
    };

    return (
        <div style={defaultStyle} {...props}>
            {children}
        </div>
    );
};

export default PhaseCard;
