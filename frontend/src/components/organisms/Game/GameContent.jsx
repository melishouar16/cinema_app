import React from 'react';
import { Evaluation } from '../../molecules';
import {
    GameHeader,
    GameIntroduction,
    InvestigationPhase,
    InterrogationPhase,
    AccusationPhase,
    GameNotes
} from '../';
import FinalScore from '../Score/FinalScore';
import evaluationService from '../../../services/evaluationService';

const GameContent = ({
    scenario, enquete, gameStarted, currentPhase, gameCompleted, discoveredIndices, interrogatedSuspects,
    playerNotes, showFinalScore, scoreInfo, hasWon, nbAccusationsRatees, isAuthenticated,
    onBackToHome, onStartInvestigation, onDiscoverIndice, onInterrogate, onMakeAccusation, onNextPhase, setPlayerNotes
}) => {
    const isInvestigationComplete = () => {
        // Au moins 3 indices ou tous les indices disponibles
        return discoveredIndices.length >= Math.min(3, scenario?.indices?.length || 0);
    };

    const isInterrogationComplete = () => {
        // Au moins 2 suspects ou tous les suspects disponibles
        return interrogatedSuspects.length >= Math.min(2, scenario?.suspects?.length || 0);
    };

    // Fonction pour évaluer l'enquête
    const handleEvaluation = async (note) => {
        // evaluation seulement si connecté
        if (!isAuthenticated) {
            alert('Vous devez être connecté pour évaluer');
            return;
        }

        try {
            await evaluationService.create(enquete.id, note);
            console.log('Évaluation envoyée avec succès');
        } catch (error) {
            console.error('Erreur évaluation:', error);
            throw error;
        }
    };

    return (
        <>
            {/* Header du jeu */}
            <GameHeader
                scenario={scenario}
                enquete={enquete}
                onBackToHome={onBackToHome}
            />

            {/* Introduction du jeu */}
            {!gameStarted && (
                <GameIntroduction
                    scenario={scenario}
                    onStartInvestigation={onStartInvestigation}
                />
            )}

            {/* Phases du jeu */}
            {gameStarted && (
                <div>
                    {currentPhase === "investigation" && !gameCompleted && (
                        <InvestigationPhase
                            scenario={scenario}
                            discoveredIndices={discoveredIndices}
                            onDiscoverIndice={onDiscoverIndice}
                            isComplete={isInvestigationComplete()}
                            onNextPhase={onNextPhase}
                        />
                    )}

                    {currentPhase === "interrogation" && !gameCompleted && (
                        <InterrogationPhase
                            scenario={scenario}
                            interrogatedSuspects={interrogatedSuspects}
                            onInterrogate={onInterrogate}
                            isComplete={isInterrogationComplete()}
                            onNextPhase={onNextPhase}
                        />
                    )}

                    {currentPhase === "accusation" && !gameCompleted && (
                        <AccusationPhase
                            scenario={scenario}
                            onMakeAccusation={onMakeAccusation}
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
                                onBackToHome={onBackToHome}
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
        </>
    );
};

export default GameContent;
