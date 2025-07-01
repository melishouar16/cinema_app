export const gameSessionService = {
    saveGameState: (sessionKey, gameState) => {
        localStorage.setItem(sessionKey, JSON.stringify(gameState));
    },

    loadGameState: (sessionKey, user) => {
        try {
            const saved = localStorage.getItem(sessionKey);
            if (saved) {
                const state = JSON.parse(saved);

                if (state.userId && state.userId !== user?.id) {
                    console.log('Session appartient à un autre utilisateur, ignorée');
                    return null;
                }

                if (state.gameCompleted) {
                    localStorage.removeItem(sessionKey);
                    return null; // on charge pas l'état, on repart à zéro
                }

                return state;
            }
        } catch (error) {
            console.log('Erreur chargement session:', error);
            localStorage.removeItem(sessionKey);
        }
        return null;
    },

    clearSession: (sessionKey) => {
        localStorage.removeItem(sessionKey);
    }
};
