import { useEffect } from 'react';
import { gameSessionService } from '../../../services/gameSessionService';
import { scoringService } from '../../../services/scoringService';

const GameSessionManager = ({
    user, enquete, scenario, sessionKey,
    gameStarted, currentPhase, gameCompleted, discoveredIndices, interrogatedSuspects,
    playerNotes, finalAccusation, hasWon, nbAccusationsRatees, scoreInfo, showFinalScore,
    setGameStarted, setCurrentPhase, setGameCompleted, setDiscoveredIndices, setInterrogatedSuspects,
    setPlayerNotes, setFinalAccusation, setHasWon, setNbAccusationsRatees, setScoreInfo, setShowFinalScore
}) => {
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

    // auto-save
    useEffect(() => {
        if (enquete && scenario) {
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
            };
            gameSessionService.saveGameState(sessionKey, gameState);
        }
    }, [gameStarted, currentPhase, gameCompleted, discoveredIndices, interrogatedSuspects, playerNotes, finalAccusation, hasWon, nbAccusationsRatees, scoreInfo, showFinalScore]);

    // charger l'état sauvegardé
    useEffect(() => {
        if (enquete && scenario) {
            setTimeout(() => {
                const state = gameSessionService.loadGameState(sessionKey, user);
                if (state) {
                    // Sinon, on charge normalement l'état sauvegardé
                    setGameStarted(state.gameStarted || false);
                    setCurrentPhase(state.currentPhase || "investigation");
                    setGameCompleted(state.gameCompleted || false);
                    setDiscoveredIndices(state.discoveredIndices || []);
                    setInterrogatedSuspects(state.interrogatedSuspects || []);
                    setPlayerNotes(state.playerNotes || "");
                    setFinalAccusation(state.finalAccusation || null);
                    setHasWon(state.hasWon || false);
                    setNbAccusationsRatees(state.nbAccusationsRatees || 0);
                    setScoreInfo(state.scoreInfo || {
                        score: 1000,
                        grade: "Apprenti Détective",
                        icon: null,
                        color: "#F59E0B"
                    });
                    setShowFinalScore(state.showFinalScore || false);
                }
            }, 100);
        }
    }, [enquete, scenario]);

    return null;
};

export default GameSessionManager;
