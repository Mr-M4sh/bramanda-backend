// ===========================
// BRAMANDA - Configuration
// Update this with your actual domain/hosting information
// ===========================

// Your hosting domain (change this to your actual domain)
const BRAMANDA_CONFIG = {
    // Backend URL - Change 'yourdomain' to your actual InfinityFree domain
    // Example: 'https://bramanda.freeinfohst.com' or your custom domain
    backendUrl: 'https://yourdomain.freeinfohst.com/backend',
    
    // Enable/Disable features
    features: {
        useMysqlBackend: true,      // Set to true when MySQL is ready
        useLocalStorageBackup: true, // Always backup to localStorage
        enableDebugLogging: true     // Show console logs for debugging
    },
    
    // Cart settings
    cart: {
        maxItems: 100,
        currencySymbol: '₹',
        currencyCode: 'INR'
    }
};

// Convenient function to get backend URLs
function getBackendUrl(endpoint) {
    return `${BRAMANDA_CONFIG.backendUrl}/${endpoint}`;
}

// Debug logging helper
function bramandaLog(message, data = null) {
    if (BRAMANDA_CONFIG.features.enableDebugLogging) {
        if (data) {
            console.log('[BRAMANDA]', message, data);
        } else {
            console.log('[BRAMANDA]', message);
        }
    }
}
