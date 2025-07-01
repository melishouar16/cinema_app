import React, { useState, useContext } from "react";
import { Container } from "../atoms";
import { useAuth } from "../../contexts/AuthContext";
import { NightModeContext } from "../../contexts/NightModeContext"; // Importer le contexte night mode
import { FaEdit } from "react-icons/fa";

// Molecules
import GameAlert from "../molecules/Game/GameAlert";
import GameScore from "../molecules/Game/GameScore";
import AuthGuard from "../molecules/Game/AuthGuard";
import LoadingScreen from "../molecules/Game/LoadingScreen";
import ErrorScreen from "../molecules/Game/ErrorScreen";

// Organisms
import GameDataLoader from "../organisms/Game/GameDataLoader";
import GameSessionManager from "../organisms/Game/GameSessionManager";
import GameContent from "../organisms/Game/GameContent";

// Services
import { gameSessionService } from "../../services/gameSessionService";

const PlayEnquete = ({ onNavigate }) => {
    const { isAuthenticated, user } = useAuth();
    const { nightMode } = useContext(NightModeContext); // Récupérer l'état du night mode

    // stocker data de l'enquete
    const [enquete, setEnquete] = useState(null);
    const [scenario, setScenario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // gerer le flow du jeu
    const [gameStarted, setGameStarted] = useState(false);
    const [currentPhase, setCurrentPhase] = useState("investigation");
    const [gameCompleted, setGameCompleted] = useState(false);

    // suivre actions du joueur
    const [discoveredIndices, setDiscoveredIndices] = useState([]);
    const [interrogatedSuspects, setInterrogatedSuspects] = useState([]);
    const [playerNotes, setPlayerNotes] = useState("");
    const [finalAccusation, setFinalAccusation] = useState(null);
    const [hasWon, setHasWon] = useState(false);

    const [nbAccusationsRatees, setNbAccusationsRatees] = useState(0);
    const [scoreInfo, setScoreInfo] = useState({
        score: 1000,
        grade: "Apprenti Détective",
        icon: FaEdit,
        color: "#F59E0B"
    });
    const [showFinalScore, setShowFinalScore] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("error");

    // Session key pour localStorage
    const sessionKey = `enquete_session_${user?.id || 'anonymous'}_${localStorage.getItem("currentEnqueteId") || 'temp'}`;

    const pageStyle = {
        backgroundColor: nightMode ? "#1a1a1a" : "white",
        color: nightMode ? "white" : "black",
        minHeight: "100vh",
        padding: "2rem",
        maxWidth: "1000px",
        margin: "0 auto"
    };

    // Retourner à la page d'accueil
    const handleBackToHome = () => {
        localStorage.removeItem("currentEnqueteId");
        gameSessionService.clearSession(sessionKey); // nettoyer la session
        if (onNavigate) onNavigate("/");
    };

    // démarrer le jeu
    const handleStartInvestigation = () => {
        setGameStarted(true);
        setCurrentPhase("investigation");
    };

    // découvrir un nouvel indice si pas découvert
    const handleDiscoverIndice = (indice) => {
        const alreadyFound = discoveredIndices.find((d) => d.numero === indice.numero);
        if (!alreadyFound) {
            setDiscoveredIndices([...discoveredIndices, indice]);
        }
    };

    // interroger un suspect
    const handleInterrogate = (suspect) => {
        // Vérifier si le suspect n'a pas déjà été interrogé
        const alreadyQuestioned = interrogatedSuspects.find((s) => s.nom === suspect.nom);
        if (!alreadyQuestioned) {
            setInterrogatedSuspects([...interrogatedSuspects, suspect]);
        }
    };

    // faire une accusation
    const handleMakeAccusation = (suspectName) => {
        const isCorrect = suspectName === scenario?.solution?.coupable;

        if (!isCorrect) {
            // Fausse accusation - incrémenter les erreurs et continuer
            setNbAccusationsRatees(prev => prev + 1);
            setAlertMessage("Mauvaise accusation ! L'enquête continue...");
            setAlertType("error");
            setShowAlert(true);
            return;
        }

        // Accusation correcte - terminer le jeu
        setFinalAccusation(suspectName);
        setCurrentPhase("verdict");
        setHasWon(true);
        setGameCompleted(true);
        setShowFinalScore(true);
    };

    const handleNextPhase = () => {
        if (currentPhase === "investigation") {
            setCurrentPhase("interrogation");
        } else if (currentPhase === "interrogation") {
            setCurrentPhase("accusation");
        }
    };

    if (!isAuthenticated) {
        return <AuthGuard onNavigate={onNavigate} />;
    }

    return (
        <>
            <GameDataLoader
                isAuthenticated={isAuthenticated}
                onDataLoaded={(enqueteData, scenarioData) => {
                    setEnquete(enqueteData);
                    setScenario(scenarioData);
                }}
                onError={setError}
                onLoadingChange={setLoading}
            />

            {/* Écran de chargement avec night mode */}
            {loading && <LoadingScreen />}

            {/* Écran d'erreur avec night mode */}
            {!loading && (error || !enquete || !scenario) && (
                <ErrorScreen error={error} onBackToHome={handleBackToHome} />
            )}

            {/* Rendu principal du jeu avec night mode */}
            {!loading && enquete && scenario && (
                <Container.Base style={pageStyle}>
                    <GameSessionManager
                        user={user}
                        enquete={enquete}
                        scenario={scenario}
                        sessionKey={sessionKey}
                        gameStarted={gameStarted}
                        currentPhase={currentPhase}
                        gameCompleted={gameCompleted}
                        discoveredIndices={discoveredIndices}
                        interrogatedSuspects={interrogatedSuspects}
                        playerNotes={playerNotes}
                        finalAccusation={finalAccusation}
                        hasWon={hasWon}
                        nbAccusationsRatees={nbAccusationsRatees}
                        scoreInfo={scoreInfo}
                        showFinalScore={showFinalScore}
                        setGameStarted={setGameStarted}
                        setCurrentPhase={setCurrentPhase}
                        setGameCompleted={setGameCompleted}
                        setDiscoveredIndices={setDiscoveredIndices}
                        setInterrogatedSuspects={setInterrogatedSuspects}
                        setPlayerNotes={setPlayerNotes}
                        setFinalAccusation={setFinalAccusation}
                        setHasWon={setHasWon}
                        setNbAccusationsRatees={setNbAccusationsRatees}
                        setScoreInfo={setScoreInfo}
                        setShowFinalScore={setShowFinalScore}
                    />

                    <GameAlert
                        showAlert={showAlert}
                        alertMessage={alertMessage}
                        alertType={alertType}
                        onClose={() => setShowAlert(false)}
                    />

                    <GameScore
                        gameStarted={gameStarted}
                        gameCompleted={gameCompleted}
                        scoreInfo={scoreInfo}
                        stats={{
                            indices: discoveredIndices.length,
                            interrogatoires: interrogatedSuspects.length,
                            erreurs: nbAccusationsRatees
                        }}
                    />

                    <GameContent
                        scenario={scenario}
                        enquete={enquete}
                        gameStarted={gameStarted}
                        currentPhase={currentPhase}
                        gameCompleted={gameCompleted}
                        discoveredIndices={discoveredIndices}
                        interrogatedSuspects={interrogatedSuspects}
                        playerNotes={playerNotes}
                        showFinalScore={showFinalScore}
                        scoreInfo={scoreInfo}
                        hasWon={hasWon}
                        nbAccusationsRatees={nbAccusationsRatees}
                        isAuthenticated={isAuthenticated}
                        onBackToHome={handleBackToHome}
                        onStartInvestigation={handleStartInvestigation}
                        onDiscoverIndice={handleDiscoverIndice}
                        onInterrogate={handleInterrogate}
                        onMakeAccusation={handleMakeAccusation}
                        onNextPhase={handleNextPhase}
                        setPlayerNotes={setPlayerNotes}
                    />
                </Container.Base>
            )}
        </>
    );
};

export default PlayEnquete;
