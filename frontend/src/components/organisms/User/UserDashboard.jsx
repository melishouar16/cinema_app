import React, { useState, useEffect, useContext } from 'react';
import UserProfile from './UserProfile';
import UserStats from './UserStats';
import EnqueteHistory from './EnqueteHistory';
import { useAuth } from '../../../contexts/AuthContext';
import { NightModeContext } from '../../../contexts/NightModeContext';
import enqueteService from '../../../services/enqueteService';

const UserDashboard = ({ onNavigate }) => {
    const { user, logout } = useAuth();
    const { nightMode } = useContext(NightModeContext);
    const [userStats, setUserStats] = useState(null);
    const [enquetesMap, setEnquetesMap] = useState(new Map());

    const containerStyle = {
        backgroundColor: nightMode ? '#1a1a1a' : '#f8f9fa',
        minHeight: '100vh',
        padding: '2rem',
        color: nightMode ? 'white' : 'black'
    };

    useEffect(() => {
        loadBasicStats();
    }, []);

    const loadEnquetesNames = async () => {
        try {
            const data = await enqueteService.getAll();
            const enquetes = data.results || data;
            const enquetesMap = new Map();

            enquetes.forEach(enquete => {
                enquetesMap.set(enquete.id.toString(), enquete.titre);
            });

            setEnquetesMap(enquetesMap);
            return enquetesMap;
        } catch (error) {
            console.warn('Erreur chargement enquêtes:', error);
            return new Map();
        }
    };

    const loadBasicStats = async () => {
        const enquetesNamesMap = await loadEnquetesNames();
        const localSessions = getLocalSessions(enquetesNamesMap);

        const stats = {
            totalEnquetes: localSessions.length,
            enquetesTerminees: localSessions.filter(s => s.gameCompleted).length,
            enquetesEnCours: localSessions.filter(s => s.gameStarted && !s.gameCompleted).length,
            tempsJeuEstime: calculateEstimatedTime(localSessions),
            enquetesRecentes: localSessions.slice(0, 5).map(session => ({
                id: session.enqueteId,
                titre: enquetesNamesMap.get(session.enqueteId) || `Enquête ${session.enqueteId}`,
                statut: session.gameCompleted ? 'terminee' :
                    session.gameStarted ? 'en_cours' : 'abandonnee',
                progression: session.gameStarted && !session.gameCompleted ?
                    calculateProgression(session) : null
            }))
        };

        setUserStats(stats);
    };

    // Sessions par utilisateur
    const getLocalSessions = (enquetesNamesMap = new Map()) => {
        const sessions = [];
        const currentUserId = user?.id?.toString();

        if (!currentUserId) return sessions;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            // Vérifier le format avec userId dans la clé
            if (key && key.startsWith(`enquete_session_${currentUserId}_`)) {
                try {
                    const sessionData = JSON.parse(localStorage.getItem(key));
                    const enqueteId = key.replace(`enquete_session_${currentUserId}_`, '');

                    // nettoyer les sessions qui n'existent plus
                    if (enquetesNamesMap.size > 0) {
                        if (enquetesNamesMap.has(enqueteId)) {
                            sessions.push({
                                enqueteId,
                                ...sessionData
                            });
                        } else {
                            console.log(`🗑️ Suppression session orpheline: ${key}`);
                            localStorage.removeItem(key);
                        }
                    } else {
                        sessions.push({
                            enqueteId,
                            ...sessionData
                        });
                    }

                } catch (error) {
                    console.warn('Session corrompue, suppression:', key);
                    localStorage.removeItem(key);
                }
            }
        }

        return sessions.reverse();
    };

    const calculateEstimatedTime = (sessions) => {
        const totalMinutes = sessions.length * 10; // 10min par session estimé
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    };

    const calculateProgression = (session) => {
        const totalActions = 10;
        const currentActions = (session.discoveredIndices?.length || 0) +
            (session.interrogatedSuspects?.length || 0) +
            (session.currentPhase === 'accusation' ? 3 :
                session.currentPhase === 'interrogation' ? 2 : 1);
        return Math.min(100, Math.round((currentActions / totalActions) * 100));
    };

    const handleContinueEnquete = (enqueteId) => {
        localStorage.setItem('currentEnqueteId', enqueteId);
        onNavigate?.('play');
    };

    return (
        <div style={containerStyle}>
            <UserProfile user={user} onLogout={logout} />
            <UserStats stats={userStats} />
            <EnqueteHistory
                enquetes={userStats?.enquetesRecentes}
                onContinueEnquete={handleContinueEnquete}
            />
        </div>
    );
};

export default UserDashboard;
