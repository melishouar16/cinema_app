const API_BASE = 'http://localhost:8000';

const evaluationService = {
    async getCurrentUserId() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch(`${API_BASE}/api/users/me/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (response.ok) {
                const user = await response.json();
                return user.id;
            }
        } catch (error) {
            console.error('Erreur récupération user:', error);
        }
        return null;
    },

    async create(enqueteId, note) {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Vous devez être connecté pour évaluer');
        }

        const userId = await this.getCurrentUserId();
        if (!userId) {
            throw new Error('Impossible de récupérer les informations utilisateur');
        }

        const response = await fetch(`${API_BASE}/api/evaluations/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                enquete: parseInt(enqueteId),
                evaluateur: userId,
                note: parseInt(note),
                commentaire: ""
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Erreur API:', errorData);
            throw new Error(errorData.detail || errorData.message || 'Erreur lors de l\'évaluation');
        }

        return response.json();
    }
};

export default evaluationService;
