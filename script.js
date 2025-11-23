// script.js - Main JavaScript file for GitHub Profile Viewer
// This handles searching GitHub profiles and displaying results
// Uses classes for organization and Anime.js for animations

// ProfileManager class - handles all GitHub profile operations
class ProfileManager {
    constructor() {
        // Array to keep track of recent searches
        this.searchHistory = [];
    }
    
    // Fetches user data from GitHub API
    async searchUser(username) {
        try {
            // Get user data from GitHub API using config settings
            const response = await fetch(`${CONFIG.API_BASE_URL}/users/${username}`);
            if (!response.ok) throw new Error('User not found');
            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch user data: ' + error.message);
        }
    }
    
    // Displays user profile information on the page
    showProfile(userData) {
        // Update all the profile elements with user data
        document.getElementById('userLogin').textContent = '@' + userData.login;
        document.getElementById('userName').textContent = userData.name || 'No name';
        document.getElementById('userBio').textContent = userData.bio || 'No bio';
        document.getElementById('avatarImg').src = userData.avatar_url;
        document.getElementById('repoCount').textContent = userData.public_repos;
        document.getElementById('followerCount').textContent = userData.followers;
        document.getElementById('followingCount').textContent = userData.following;
        document.getElementById('githubLink').href = userData.html_url;
    }
    
    // Saves search to browser's local storage
    saveToHistory(username) {
        let history = JSON.parse(localStorage.getItem('githubSearchHistory')) || [];
        history = history.filter(item => item !== username);
        history.unshift(username);
        localStorage.setItem('githubSearchHistory', JSON.stringify(history.slice(0, 5)));
    }
}

// FormHandler class - manages contact form operations
class FormHandler {
    constructor() {
        // Key for storing form data in local storage
        this.storageKey = 'contactSubmissions';
    }
    
    // Saves form data to local storage
    saveForm(formData) {
        let submissions = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        submissions.push(formData);
        localStorage.setItem(this.storageKey, JSON.stringify(submissions));
        return formData;
    }
}

// Start the application when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create instances of our classes
    const profileManager = new ProfileManager();
    const formHandler = new FormHandler();
    
    // Get references to important HTML elements
    const searchBtn = document.getElementById('searchBtn');
    const usernameInput = document.getElementById('usernameInput');
    const profileSection = document.getElementById('profileSection');
    const contactForm = document.getElementById('contactForm') || document.querySelector('.contact-form');

    // Set up search functionality
    if (searchBtn && usernameInput) {
        // Search when button is clicked
        searchBtn.addEventListener('click', handleSearch);
        
        // Search when Enter key is pressed
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // Handle GitHub user search
    async function handleSearch() {
        const username = usernameInput.value.trim();
        
        // Check if user entered something
        if (username === '') {
            alert('Please enter username');
            return;
        }
        
        // Show loading state
        searchBtn.textContent = 'Searching...';
        searchBtn.disabled = true;
        
        try {
            // Get and display user data
            const userData = await profileManager.searchUser(username);
            profileManager.showProfile(userData);
            profileManager.saveToHistory(username);
            
            // Show profile with smooth animation
            profileSection.style.display = 'block';
            anime({
                targets: '#profileSection',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 600,
                easing: 'easeOutQuad'
            });
            
        } catch (error) {
            // Show error message if something goes wrong
            alert('Error: ' + error.message);
        }
        
        // Reset button to normal state
        searchBtn.textContent = 'Search';
        searchBtn.disabled = false;
    }

    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data from user input
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            // Save form data and show success message
            formHandler.saveForm(formData);
            alert('Thank you for your message! We have received your feedback and saved it successfully.');
            
            // Clear the form
            this.reset();
            
            // Log for development (remove in production)
            console.log('Form data saved:', formData);
        });
    }
});
