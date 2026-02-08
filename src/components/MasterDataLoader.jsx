import { useEffect } from 'react';

const MasterDataLoader = () => {
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        // Only load if we have an auth token and haven't loaded yet
        const token = localStorage.getItem('auth_token');
        const alreadyLoaded = localStorage.getItem('masterDataLoaded');

        if (!token || alreadyLoaded) {
          return;
        }

        console.log('MasterDataLoader: Starting to load essential data...');

        // For now, just set empty arrays to prevent crashes
        // This ensures the app works even if backend is not available
        const essentialKeys = ['fuelProducts', 'vendors', 'tanks'];

        essentialKeys.forEach(key => {
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([]));
            console.log(`MasterDataLoader: Set empty array for ${key}`);
          }
        });

        // Mark as loaded to prevent repeated attempts
        localStorage.setItem('masterDataLoaded', 'true');
        console.log('MasterDataLoader: Essential data setup complete');

      } catch (error) {
        console.error('MasterDataLoader: Error during setup:', error);
        // Ensure essential keys exist even on error
        const essentialKeys = ['fuelProducts', 'vendors', 'tanks'];
        essentialKeys.forEach(key => {
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([]));
          }
        });
      }
    };

    // Use setTimeout to avoid blocking the initial render
    setTimeout(loadMasterData, 100);
  }, []);

  return null; // This component doesn't render anything
};

export default MasterDataLoader;