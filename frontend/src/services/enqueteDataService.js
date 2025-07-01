import enqueteService from "./enqueteService";

export const enqueteDataService = {
    loadEnquete: async (isAuthenticated) => {
        // bloquer si pas connecté
        if (!isAuthenticated) {
            throw new Error("Vous devez être connecté pour jouer");
        }

        // Récupérer l'enquete
        const enqueteId = localStorage.getItem("currentEnqueteId");
        if (!enqueteId) {
            throw new Error("Aucune enquête sélectionnée");
        }

        const enqueteData = await enqueteService.getById(enqueteId);

        // parser le json de l'enquete
        let parsedScenario = null;
        if (enqueteData.scenario_json) {
            parsedScenario = JSON.parse(enqueteData.scenario_json);
        }

        return { enquete: enqueteData, scenario: parsedScenario };
    }
};
