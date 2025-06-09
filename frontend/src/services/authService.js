const API_BASE = 'http://localhost:8000';

const authService = {
    // Connexion
    async login(username, password) {
        const response = await fetch(`${API_BASE}/api-token-auth/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Identifiants incorrects');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data;
    },

    // Récupérer le profil
    async getProfile() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${API_BASE}/api/users/me/`, {
            headers: { 'Authorization': `Token ${token}` }
        });

        if (!response.ok) {
            localStorage.removeItem('token');
            return null;
        }

        return response.json();
    },

    // Déconnexion
    logout() {
        localStorage.removeItem('token');
    },

    // Vérifier si connecté
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // Obtenir le token pour les requêtes API
    getToken() {
        return localStorage.getItem('token');
    }
};

export default authService;
