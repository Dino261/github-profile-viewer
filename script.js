// script.js - Main code for GitHub Profile Viewer
// This file makes the search and contact form work

// ProfileManager - Handles searching and showing GitHub profiles
class ProfileManager {
    constructor() {
        // Stores all searched usernames during current session
        this.searchHistory = [];
    }
    
    // Searches for a GitHub user and gets their info
    // @returns {Object} User profile data from GitHub API
    // @param {string} username - GitHub username to search for
    async searchUser(username) {
        try {
            // Ask GitHub for user data
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error('User not found');
            
            // Add this username to our search history
            this.searchHistory.push(username);
            
            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch user data');
        }
    }
    
    // Displays user profile information on the page
    // @returns {void} Nothing - updates DOM directly
    // @param {Object} userData - User profile data from GitHub API
    showProfile(userData) {
        document.getElementById('userLogin').textContent = '@' + userData.login;
        document.getElementById('userName').textContent = userData.name || 'No name';
        document.getElementById('userBio').textContent = userData.bio || 'No bio';
        document.getElementById('avatarImg').src = userData.avatar_url;
        document.getElementById('repoCount').textContent = userData.public_repos;
        document.getElementById('followerCount').textContent = userData.followers;
        document.getElementById('followingCount').textContent = userData.following;
        document.getElementById('githubLink').href = userData.html_url;
    }
}

// FormHandler - Saves contact form messages
class FormHandler {
    constructor() {
        // Key name for storing form data in browser storage
        this.storageKey = 'contactSubmissions';
    }
    
    // Saves form data to browser's local storage
    // @returns {void} Nothing - saves data to localStorage
    // @param {Object} formData - Form data object with name, email, subject, message
    saveForm(formData) {
        // Get old messages or start with empty list
        let submissions = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        // Add new message to the list
        submissions.push(formData);
        // Save updated list back to storage
        localStorage.setItem(this.storageKey, JSON.stringify(submissions));
    }
}

// Start the app when page loads
// Initializes classes and sets up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Create our main tools
    const profileManager = new ProfileManager();
    const formHandler = new FormHandler();
    
    // Find important parts of the page
    const searchBtn = document.getElementById('searchBtn');
    const usernameInput = document.getElementById('usernameInput');
    const profileSection = document.getElementById('profileSection');
    const contactForm = document.querySelector('.contact-form');
    
    // Stops people from searching twice at same time
    let isSearching = false;

    // Make search button work when clicked
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Make search work when pressing Enter key
    if (usernameInput) {
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // Handles user search functionality
    // @returns {Promise} Resolves when search completes
    async function handleSearch() {
        // Don't search if already searching
        if (isSearching) return;
        
        // Get the username from search box
        const username = usernameInput.value.trim();
        
        // Check if user typed something
        if (!username) {
            alert('Please enter a username');
            profileSection.style.display = 'none';
            return;
        }
        
        // GitHub usernames can't have spaces
        if (username.includes(' ')) {
            alert('GitHub usernames cannot contain spaces');
            return;
        }
        
        // Show that we're searching
        isSearching = true;
        searchBtn.textContent = 'Searching...';
        searchBtn.disabled = true;
        
        try {
            // Get user data from GitHub
            const userData = await profileManager.searchUser(username);
            // Show the user's profile
            profileManager.showProfile(userData);
            
            // Make profile appear with nice animation
            profileSection.style.display = 'block';
            anime({
                targets: '#profileSection',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 600,
                easing: 'easeOutQuad'
            });
            
        } catch (error) {
            // Show error if something went wrong
            alert('Error: ' + error.message);
            profileSection.style.display = 'none';
        }
        
        // Reset search button
        searchBtn.textContent = 'Search';
        searchBtn.disabled = false;
        isSearching = false;
    }

    // Handles contact form submission
    // @returns {void} Nothing - saves form data and shows alert
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Stop form from reloading page
            e.preventDefault();
            
            // Get what user typed in form
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Check if user filled all fields
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Check if email looks right
            if (!email.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Save the form data
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            // Save to browser storage and show message
            formHandler.saveForm(formData);
            alert('Thank you for your message!');
            // Clear the form
            this.reset();
        });
    }
});
