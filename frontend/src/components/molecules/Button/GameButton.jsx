
import { Container, Typography } from "../../atoms"

const GameButton = ({
    callBack,
    children,
    bgColor = "#4A90E2",
    textColor = "white",
    disabled = false,
    ...props
}) => (
    <Container.Base
        onClick={disabled ? undefined : callBack}
        style={{
            backgroundColor: disabled ? "#ccc" : bgColor,
            color: disabled ? "#666" : textColor,
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "4px",
            cursor: disabled ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            opacity: disabled ? 0.6 : 1,
            ...props.style,
        }}
        {...props}
    >
        <Typography.Paragraph style={{
            margin: 0,
            color: "inherit" // Hérite de la couleur du parent
        }}>
            {children}
        </Typography.Paragraph>
    </Container.Base>
)

export default GameButton
