import { useEffect } from 'react';
import { enqueteDataService } from '../../../services/enqueteDataService';

const GameDataLoader = ({ isAuthenticated, onDataLoaded, onError, onLoadingChange }) => {
    useEffect(() => {
        const loadData = async () => {
            try {
                const { enquete, scenario } = await enqueteDataService.loadEnquete(isAuthenticated);
                onDataLoaded(enquete, scenario);
            } catch (err) {
                onError(err.message);
            } finally {
                onLoadingChange(false);
            }
        };

        loadData();
    }, [isAuthenticated]);

    return null;
};

export default GameDataLoader;
