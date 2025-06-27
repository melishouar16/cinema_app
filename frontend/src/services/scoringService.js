import { FaUserSecret, FaBullseye, FaSearch, FaEdit } from 'react-icons/fa';

export const scoringService = {
    calculateScore: (nbIndices, nbInterrogatoires, nbErreurs) => {
        let score = 1000;

        // Malus seulement après les seuils gratuits
        const indicesSupplementaires = Math.max(0, nbIndices - 3);        // 3 premiers gratuits
        const interrogatoiresSupplementaires = Math.max(0, nbInterrogatoires - 2); // 2 premiers gratuits

        score -= indicesSupplementaires * 25;
        score -= interrogatoiresSupplementaires * 40;
        score -= nbErreurs * 100;

        return Math.max(200, score);
    },

    getGrade: (score) => {

        if (score >= 900) return {
            grade: "★★★ Sherlock Holmes",
            icon: FaUserSecret,
            color: "#8B5CF6"
        };
        if (score >= 700) return {
            grade: "★★ Détective Expert",
            icon: FaBullseye,
            color: "#06B6D4"
        };
        if (score >= 500) return {
            grade: "★ Enquêteur Confirmé",
            icon: FaSearch,
            color: "#10B981"
        };

        return {
            grade: "Apprenti Détective",
            icon: FaEdit,
            color: "#F59E0B"
        };
    },

    getScoreInfo: (nbIndices, nbInterrogatoires, nbErreurs) => {
        const score = scoringService.calculateScore(nbIndices, nbInterrogatoires, nbErreurs);
        const gradeInfo = scoringService.getGrade(score);
        return { score, ...gradeInfo };
    },

    getMessage: (score) => {
        if (score >= 900) return " Bravo Sherlock !";
        if (score >= 700) return "Excellent travail !";
        if (score >= 500) return "Bon travail !";
        return "Continuez à vous entraîner !";
    }
};
