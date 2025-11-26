// config.js - Settings for GitHub Profile Viewer
// This file stores all the app settings like API links

// App settings - things that might change
const CONFIG = {
    // GitHub API key - leave empty to use public API (60 searches per hour)
    GITHUB_API_KEY: '',
    
    // Website address for GitHub API
    API_BASE_URL: 'https://api.github.com'
};

// Show message when app starts
console.log('GitHub Profile Viewer: Ready to search!');
