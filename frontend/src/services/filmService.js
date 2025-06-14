const API_BASE = 'http://localhost:8000';

const filmService = {
    // Récupérer tous les films
    async getAll() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/films/`, {
            headers: {
                'Authorization': token ? `Token ${token}` : ''
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des films');
        }

        return response.json();
    },

    // Récupérer un film par ID
    async getById(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/films/${id}/`, {
            headers: {
                'Authorization': token ? `Token ${token}` : ''
            }
        });

        if (!response.ok) {
            throw new Error('Film non trouvé');
        }

        return response.json();
    },

    // Créer un nouveau film
    async create(filmData) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Vous devez être connecté pour créer un film');
        }

        const response = await fetch(`${API_BASE}/api/films/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(filmData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erreur lors de la création du film');
        }

        return response.json();
    },

    // Rechercher des films par titre
    async search(query) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/films/?search=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': token ? `Token ${token}` : ''
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la recherche');
        }

        return response.json();
    }
};

export default filmService;
