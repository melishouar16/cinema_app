import { useState, useEffect, useContext } from "react"
import { Container, Typography } from "../atoms"
import { useAuth } from "../../contexts/AuthContext"
import { NightModeContext } from "../../contexts/NightModeContext" // Importer le contexte night mode
import enqueteService from "../../services/enqueteService"
import {
    GameHeader,
    GameIntroduction,
    InvestigationPhase,
    InterrogationPhase,
    AccusationPhase,
    GameSolution,
    GameNotes
} from "../organisms"
import { FaSearch, FaTimes, FaArrowLeft } from "react-icons/fa"
import { Button } from "../molecules"

const PlayEnquete = ({ onNavigate }) => {
    const { isAuthenticated } = useAuth()
    const { nightMode } = useContext(NightModeContext) // Récupérer l'état du night mode

    // stocker data de l'enquete
    const [enquete, setEnquete] = useState(null) // L'enquête complète depuis l'API
    const [scenario, setScenario] = useState(null) // Le scénario JSON parsé
    const [loading, setLoading] = useState(true) // Pour afficher le loader
    const [error, setError] = useState(null) // Messages d'erreur

    // gerer le flow du jeu
    const [gameStarted, setGameStarted] = useState(false) // Le jeu a-t-il commencé ?
    const [currentPhase, setCurrentPhase] = useState("investigation") // Phase actuelle du jeu
    const [gameCompleted, setGameCompleted] = useState(false) // Le jeu est-il fini ?

    // suivre actions du joueur
    const [discoveredIndices, setDiscoveredIndices] = useState([]) // Liste des indices trouvés
    const [interrogatedSuspects, setInterrogatedSuspects] = useState([]) // Liste des suspects interrogés
    const [playerNotes, setPlayerNotes] = useState("") // Notes prises par le joueur
    const [finalAccusation, setFinalAccusation] = useState(null) // Qui le joueur accuse
    const [hasWon, setHasWon] = useState(false) // Le joueur a-t-il gagné ?

    // Styles dynamiques selon le night mode
    const pageStyle = {
        backgroundColor: nightMode ? "#1a1a1a" : "white",
        color: nightMode ? "white" : "black",
        minHeight: "100vh",
        padding: "2rem",
        maxWidth: "1000px",
        margin: "0 auto"
    }

    const loadingErrorStyle = {
        backgroundColor: nightMode ? "#1a1a1a" : "white",
        color: nightMode ? "white" : "black",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center"
    }

    useEffect(() => {
        loadEnquete()
    }, [isAuthenticated])

    const loadEnquete = async () => {
        try {
            // Récupérer l'enquete
            const enqueteId = localStorage.getItem("currentEnqueteId")

            if (!enqueteId) {
                setError("Aucune enquête sélectionnée")
                return
            }

            const enqueteData = await enqueteService.getById(enqueteId)
            setEnquete(enqueteData)

            // parser le json de l'enquete
            if (enqueteData.scenario_json) {
                const parsedScenario = JSON.parse(enqueteData.scenario_json)
                setScenario(parsedScenario)
            }
        } catch (err) {
            setError("Erreur lors du chargement de l'enquête")
        } finally {
            setLoading(false)
        }
    }

    // Retourner à la page d'accueil
    const handleBackToHome = () => {
        localStorage.removeItem("currentEnqueteId")
        if (onNavigate) onNavigate("home")
    }

    // démarrer le jeu
    const handleStartInvestigation = () => {
        setGameStarted(true)
        setCurrentPhase("investigation")
    }

    // découvrir un nouvel indice si pas découvert
    const handleDiscoverIndice = (indice) => {
        const alreadyFound = discoveredIndices.find((d) => d.numero === indice.numero)
        if (!alreadyFound) {
            setDiscoveredIndices([...discoveredIndices, indice])
        }
    }

    // interroger un suspect
    const handleInterrogate = (suspect) => {
        // Vérifier si le suspect n'a pas déjà été interrogé
        const alreadyQuestioned = interrogatedSuspects.find((s) => s.nom === suspect.nom)
        if (!alreadyQuestioned) {
            setInterrogatedSuspects([...interrogatedSuspects, suspect])
        }
    }

    const handleMakeAccusation = (suspectName) => {
        setFinalAccusation(suspectName)
        setCurrentPhase("verdict")

        // vérifier si c'est le bon coupable
        const isCorrect = suspectName === scenario?.solution?.coupable
        setHasWon(isCorrect)
        setGameCompleted(true)
    }

    const handleNextPhase = () => {
        if (currentPhase === "investigation") {
            setCurrentPhase("interrogation")
        } else if (currentPhase === "interrogation") {
            setCurrentPhase("accusation")
        }
    }

    const isInvestigationComplete = () => {
        // Au moins 3 indices ou tous les indices disponibles
        return discoveredIndices.length >= Math.min(3, scenario?.indices?.length || 0)
    }

    const isInterrogationComplete = () => {
        // Au moins 2 suspects ou tous les suspects disponibles
        return interrogatedSuspects.length >= Math.min(2, scenario?.suspects?.length || 0)
    }

    // Écran de chargement avec night mode
    if (loading) {
        return (
            <Container.Base style={loadingErrorStyle}>
                <FaSearch style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    color: nightMode ? "white" : "black"
                }} />
                <Typography.Title style={{ color: nightMode ? "white" : "black" }}>
                    Chargement de l'enquête...
                </Typography.Title>
            </Container.Base>
        )
    }

    // Écran d'erreur avec night mode
    if (error || !enquete || !scenario) {
        return (
            <Container.Base style={loadingErrorStyle}>
                <FaTimes style={{
                    fontSize: "3rem",
                    color: "#dc3545",
                    marginBottom: "1rem"
                }} />
                <Typography.Title style={{ color: nightMode ? "white" : "black" }}>
                    Erreur
                </Typography.Title>
                <Typography.Paragraph style={{
                    color: "#dc3545",
                    marginBottom: "2rem"
                }}>
                    {error || "Enquête ou scénario introuvable"}
                </Typography.Paragraph>
                <Button.GameButton callBack={handleBackToHome} bgColor="#6c757d">
                    <FaArrowLeft style={{ marginRight: "0.5rem" }} />
                    Retour à l'accueil
                </Button.GameButton>
            </Container.Base>
        )
    }

    // Rendu principal du jeu avec night mode
    return (
        <Container.Base style={pageStyle}>
            <GameHeader
                scenario={scenario}
                enquete={enquete}
                onBackToHome={handleBackToHome}
            />

            {!gameStarted && (
                <GameIntroduction
                    scenario={scenario}
                    onStartInvestigation={handleStartInvestigation}
                />
            )}

            {gameStarted && (
                <div style={{ display: "grid", gap: "2rem" }}>
                    {currentPhase === "investigation" && (
                        <InvestigationPhase
                            scenario={scenario}
                            discoveredIndices={discoveredIndices}
                            onDiscoverIndice={handleDiscoverIndice}
                            isComplete={isInvestigationComplete()}
                            onNextPhase={handleNextPhase}
                        />
                    )}

                    {currentPhase === "interrogation" && (
                        <InterrogationPhase
                            scenario={scenario}
                            interrogatedSuspects={interrogatedSuspects}
                            onInterrogate={handleInterrogate}
                            isComplete={isInterrogationComplete()}
                            onNextPhase={handleNextPhase}
                        />
                    )}

                    {currentPhase === "accusation" && !gameCompleted && (
                        <AccusationPhase
                            scenario={scenario}
                            onMakeAccusation={handleMakeAccusation}
                        />
                    )}

                    {gameCompleted && (
                        <GameSolution
                            scenario={scenario}
                            hasWon={hasWon}
                            finalAccusation={finalAccusation}
                            onBackToHome={handleBackToHome}
                        />
                    )}

                    {!gameCompleted && (
                        <GameNotes
                            playerNotes={playerNotes}
                            setPlayerNotes={setPlayerNotes}
                        />
                    )}
                </div>
            )}
        </Container.Base>
    )
}

export default PlayEnquete
