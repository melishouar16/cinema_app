import React from 'react';
import { LiveScore } from '../Score';

const GameScore = ({ gameStarted, gameCompleted, scoreInfo, stats }) => {
    /* Indicateur de score en temps réel */
    if (!gameStarted || gameCompleted) return null;
    return (
        <LiveScore
            scoreInfo={scoreInfo}
            stats={stats}
        />
    );
};

export default GameScore;
