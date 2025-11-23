// config.js - Configuration file for GitHub Profile Viewer
// This file stores settings that might change, like API URLs
// Used by script.js to keep all settings in one place

// Application settings - these can be easily changed here
const CONFIG = {
    // GitHub API key - leave empty to use public API (60 requests per hour)
    GITHUB_API_KEY: '',
    
    // Base URL for GitHub API - where we get user data from
    API_BASE_URL: 'https://api.github.com'
};

// Message to show in console during development
console.log('GitHub Profile Viewer: Using public API (60 requests/hour)');
