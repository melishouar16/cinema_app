const API_BASE = 'http://localhost:8000';

const enqueteService = {
    // Récupérer toutes les enquêtes
    async getAll() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/enquetes/`, {
            headers: {
                'Authorization': token ? `Token ${token}` : ''
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des enquêtes');
        }

        return response.json();
    },

    // Récupérer une enquête par ID
    async getById(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/enquetes/${id}/`, {
            headers: {
                'Authorization': token ? `Token ${token}` : ''
            }
        });

        if (!response.ok) {
            throw new Error('Enquête non trouvée');
        }

        return response.json();
    },

    // Créer une nouvelle enquête
    async create(enqueteData) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Vous devez être connecté pour créer une enquête');
        }

        const response = await fetch(`${API_BASE}/api/enquetes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(enqueteData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erreur lors de la création de l\'enquête');
        }

        return response.json();
    },

    // Mettre à jour une enquête
    async update(id, enqueteData) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Vous devez être connecté');
        }

        const response = await fetch(`${API_BASE}/api/enquetes/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(enqueteData)
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour');
        }

        return response.json();
    }
};

export default enqueteService;
