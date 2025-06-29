import { useState, useEffect, useContext } from "react"
import { Container, Typography } from "../atoms"
import { useAuth } from "../../contexts/AuthContext"
import { NightModeContext } from "../../contexts/NightModeContext" // Importer le contexte night mode
import enqueteService from "../../services/enqueteService"
import evaluationService from "../../services/evaluationService";
import { Evaluation } from "../molecules";
import {
    GameHeader,
    GameIntroduction,
    InvestigationPhase,
    InterrogationPhase,
    AccusationPhase,
    GameNotes
} from "../organisms"
import { FaSearch, FaTimes, FaArrowLeft, FaEdit } from "react-icons/fa"
import { Button, Alerte } from "../molecules"

// Imports pour le scoring
import { LiveScore } from '../molecules/Score'
import FinalScore from '../organisms/Score/FinalScore'
import { scoringService } from '../../services/scoringService'

const PlayEnquete = ({ onNavigate }) => {
    const { isAuthenticated, user } = useAuth()
    const { nightMode } = useContext(NightModeContext) // Récupérer l'état du night mode

    // stocker data de l'enquete
    const [enquete, setEnquete] = useState(null)
    const [scenario, setScenario] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // gerer le flow du jeu
    const [gameStarted, setGameStarted] = useState(false)
    const [currentPhase, setCurrentPhase] = useState("investigation")
    const [gameCompleted, setGameCompleted] = useState(false)

    // suivre actions du joueur
    const [discoveredIndices, setDiscoveredIndices] = useState([])
    const [interrogatedSuspects, setInterrogatedSuspects] = useState([])
    const [playerNotes, setPlayerNotes] = useState("")
    const [finalAccusation, setFinalAccusation] = useState(null)
    const [hasWon, setHasWon] = useState(false)


    const [nbAccusationsRatees, setNbAccusationsRatees] = useState(0)
    const [scoreInfo, setScoreInfo] = useState({
        score: 1000,
        grade: "Apprenti Détective",
        icon: FaEdit,
        color: "#F59E0B"
    })
    const [showFinalScore, setShowFinalScore] = useState(false)


    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertType, setAlertType] = useState("error")

    // Session key pour localStorage
    const sessionKey = `enquete_session_${localStorage.getItem("currentEnqueteId") || 'temp'}`


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

    // mettre à jour le score
    const updateScore = () => {
        const newScoreInfo = scoringService.getScoreInfo(
            discoveredIndices.length,
            interrogatedSuspects.length,
            nbAccusationsRatees
        );
        setScoreInfo(newScoreInfo);
    };


    useEffect(() => {
        if (gameStarted) {
            updateScore();
        }
    }, [discoveredIndices.length, interrogatedSuspects.length, nbAccusationsRatees, gameStarted]);


    const saveGameState = () => {
        const gameState = {
            userId: user?.id,
            gameStarted,
            currentPhase,
            gameCompleted,
            discoveredIndices,
            interrogatedSuspects,
            playerNotes,
            finalAccusation,
            hasWon,
            nbAccusationsRatees,
            scoreInfo,
            showFinalScore,
            lastSaved: new Date().toISOString()
        }
        localStorage.setItem(sessionKey, JSON.stringify(gameState))
    }

    const loadGameState = () => {
        try {
            const saved = localStorage.getItem(sessionKey)
            if (saved) {
                const state = JSON.parse(saved)

                if (state.userId && state.userId !== user?.id) {
                    console.log('Session appartient à un autre utilisateur, ignorée')
                    return
                }

                if (state.gameCompleted) {


                    localStorage.removeItem(sessionKey)
                    return // on charge pas l'état, on repart à zéro
                }

                // Sinon, on charge normalement l'état sauvegardé
                setGameStarted(state.gameStarted || false)
                setCurrentPhase(state.currentPhase || "investigation")
                setGameCompleted(state.gameCompleted || false)
                setDiscoveredIndices(state.discoveredIndices || [])
                setInterrogatedSuspects(state.interrogatedSuspects || [])
                setPlayerNotes(state.playerNotes || "")
                setFinalAccusation(state.finalAccusation || null)
                setHasWon(state.hasWon || false)
                setNbAccusationsRatees(state.nbAccusationsRatees || 0)
                setScoreInfo(state.scoreInfo || {
                    score: 1000,
                    grade: "Apprenti Détective",
                    icon: FaEdit,
                    color: "#F59E0B"
                })
                setShowFinalScore(state.showFinalScore || false)
            }
        } catch (error) {
            console.log('Erreur chargement session:', error)
            localStorage.removeItem(sessionKey)
        }
    }

    useEffect(() => {
        loadEnquete()
    }, [isAuthenticated])

    // auto-save
    useEffect(() => {
        if (enquete && scenario) {
            saveGameState()
        }
    }, [gameStarted, currentPhase, gameCompleted, discoveredIndices, interrogatedSuspects, playerNotes, finalAccusation, hasWon, nbAccusationsRatees, scoreInfo, showFinalScore])

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

            // charger l'état sauvegardé
            setTimeout(() => loadGameState(), 100)

        } catch (err) {
            setError("Erreur lors du chargement de l'enquête")
        } finally {
            setLoading(false)
        }
    }

    // Retourner à la page d'accueil
    const handleBackToHome = () => {
        localStorage.removeItem("currentEnqueteId")
        localStorage.removeItem(sessionKey) // nettoyer la session
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

    // Fonction pour évaluer l'enquête
    const handleEvaluation = async (note) => {
        try {
            await evaluationService.create(enquete.id, note);
            console.log('Évaluation envoyée avec succès');
        } catch (error) {
            console.error('Erreur évaluation:', error);
            throw error;
        }
    };

    // faire une accusation
    const handleMakeAccusation = (suspectName) => {
        const isCorrect = suspectName === scenario?.solution?.coupable

        if (!isCorrect) {
            // Fausse accusation - incrémenter les erreurs et continuer
            setNbAccusationsRatees(prev => prev + 1)
            setAlertMessage(" Mauvaise accusation ! L'enquête continue...")
            setAlertType("error")
            setShowAlert(true)
            return
        }

        // Accusation correcte - terminer le jeu
        setFinalAccusation(suspectName)
        setCurrentPhase("verdict")
        setHasWon(true)
        setGameCompleted(true)
        setShowFinalScore(true)
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
                    {error || "Enquête introuvable"}
                </Typography.Title>
                <Button.Default
                    callBack={handleBackToHome}
                    style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1.5rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    <FaArrowLeft style={{ marginRight: "0.5rem" }} />
                    Retour à l'accueil
                </Button.Default>
            </Container.Base>
        )
    }

    // Rendu principal du jeu avec night mode
    return (
        <Container.Base style={pageStyle}>
            {/* Alerte personnalisée */}
            <Alerte.CustomAlert
                isVisible={showAlert}
                message={alertMessage}
                type={alertType}
                onClose={() => setShowAlert(false)}
            />

            {/* Indicateur de score en temps réel */}
            {gameStarted && !gameCompleted && (
                <LiveScore
                    scoreInfo={scoreInfo}
                    stats={{
                        indices: discoveredIndices.length,
                        interrogatoires: interrogatedSuspects.length,
                        erreurs: nbAccusationsRatees
                    }}
                />
            )}

            {/* Header du jeu */}
            <GameHeader
                scenario={scenario}
                enquete={enquete}
                onBackToHome={handleBackToHome}
            />

            {/* Introduction du jeu */}
            {!gameStarted && (
                <GameIntroduction
                    scenario={scenario}
                    onStartInvestigation={handleStartInvestigation}
                />
            )}

            {/* Phases du jeu */}
            {gameStarted && (
                <div>
                    {currentPhase === "investigation" && !gameCompleted && (
                        <InvestigationPhase
                            scenario={scenario}
                            discoveredIndices={discoveredIndices}
                            onDiscoverIndice={handleDiscoverIndice}
                            isComplete={isInvestigationComplete()}
                            onNextPhase={handleNextPhase}
                        />
                    )}

                    {currentPhase === "interrogation" && !gameCompleted && (
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

                    {showFinalScore && (
                        <>
                            <FinalScore
                                scoreInfo={scoreInfo}
                                stats={{
                                    indices: discoveredIndices.length,
                                    interrogatoires: interrogatedSuspects.length,
                                    erreurs: nbAccusationsRatees
                                }}
                                hasWon={hasWon}
                                onBackToHome={handleBackToHome}
                                scenario={scenario}
                            />

                            {hasWon && <Evaluation.Form onSubmit={handleEvaluation} />}
                        </>
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
