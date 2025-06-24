// frontend/src/services/enqueteService.js
const API_BASE = 'http://localhost:8000';

const enqueteService = {
    // Récupérer toutes les enquêtes
    async getAll() {
        console.log('🔍 Début récupération enquêtes...');
        console.log('🌐 URL:', `${API_BASE}/api/enquetes/`);

        const token = localStorage.getItem('token');
        console.log('🔑 Token:', token ? 'Présent' : 'Absent');

        const headers = {
            'Authorization': token ? `Token ${token}` : ''
        };
        console.log('📋 Headers:', headers);

        try {
            const response = await fetch(`${API_BASE}/api/enquetes/`, { headers });

            console.log('📡 Réponse status:', response.status);
            console.log('📡 Réponse ok:', response.ok);
            console.log('📡 Réponse headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur réponse:', errorText);
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Données reçues:', data);
            console.log('📊 Nombre d\'enquêtes:', data.length || (data.results && data.results.length) || 'Inconnu');

            return data;
        } catch (error) {
            console.error('💥 Erreur fetch:', error);
            throw error;
        }
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
        console.log('📤 Données envoyées à l\'API:', enqueteData);
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
            // Gestion d'erreur améliorée
            const errorMessage = errorData.film_source?.[0] || errorData.createur?.[0] || errorData.detail || 'Erreur lors de la création de l\'enquête';
            throw new Error(errorMessage);
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
