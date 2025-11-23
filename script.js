/**
 * GitHub Profile Viewer - Main Application Script
 * 
 * This script handles all client-side functionality including:
 * - GitHub API integration for user profile searches
 * - Contact form handling with local storage
 * - Smooth animations using Anime.js library
 * - User input validation and error handling
 * 
 * @file script.js
 * @version 1.0
 * @author Your Name
 */

// Wait for the DOM to fully load before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    /**
     * DOM Elements - Cache frequently accessed elements
     * @type {HTMLElement}
     */
    const searchBtn = document.getElementById('searchBtn');
    const usernameInput = document.getElementById('usernameInput');
    const profileSection = document.getElementById('profileSection');

    // Check if search elements exist (prevents errors on contact.html)
    if (searchBtn && usernameInput) {
        /**
         * Event Listener - Search button click handler
         */
        searchBtn.addEventListener('click', searchUser);

        /**
         * Event Listener - Enter key support in search input
         * @param {KeyboardEvent} e - Keyboard event object
         */
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchUser();
        });
    }

    /**
     * Contact Form Handler - Manages form submissions on contact.html
     * @type {HTMLElement}
     */
    const contactForm = document.getElementById('contactForm') || 
                       document.querySelector('.contact-form');

    if (contactForm) {
        /**
         * Event Listener - Contact form submission handler
         * @param {Event} e - Form submission event
         */
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            /**
             * Form Data Object - Collects and structures user input
             * @type {Object}
             * @property {string} name - User's full name
             * @property {string} email - User's email address
             * @property {string} subject - Message subject
             * @property {string} message - User's message content
             * @property {string} timestamp - ISO string of submission time
             */
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            /**
             * Local Storage Management - Saves form submissions
             * @type {Array}
             */
            let submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
            submissions.push(formData);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
            
            // User feedback
            alert('Thank you for your message! We have received your feedback and saved it successfully.');
            
            // Reset form fields
            this.reset();
            
            // Development logging for assessment verification
            console.log('Form data saved:', formData);
            console.log('All submissions:', submissions);
        });
    }

    /**
     * Main Search Function - Fetches and displays GitHub user profiles
     * @async
     * @function searchUser
     * @returns {Promise<void>}
     */
    async function searchUser() {
        /**
         * Username Input - Trimmed user input value
         * @type {string}
         */
        const username = usernameInput.value.trim();
        
        // Input validation - check for empty username
        if (username === '') {
            alert('Please enter username');
            return;
        }
        
        // Loading state - Update UI to show processing
        searchBtn.textContent = 'Searching...';
        searchBtn.disabled = true;
        
        try {
            /**
             * API Request - Fetch user data from GitHub API
             * @type {Response}
             */
            const response = await fetch('https://api.github.com/users/' + username);
            
            // Error handling for API response
            if (!response.ok) throw new Error('User not found');
            
            /**
             * User Data - Parsed JSON response from GitHub API
             * @type {Object}
             */
            const userData = await response.json();
            
            // Update DOM with user profile data
            document.getElementById('userLogin').textContent = '@' + userData.login;
            document.getElementById('userName').textContent = userData.name || 'No name';
            document.getElementById('userBio').textContent = userData.bio || 'No bio';
            document.getElementById('avatarImg').src = userData.avatar_url;
            document.getElementById('repoCount').textContent = userData.public_repos;
            document.getElementById('followerCount').textContent = userData.followers;
            document.getElementById('followingCount').textContent = userData.following;
            document.getElementById('githubLink').href = userData.html_url;
            
            // Show profile section with Anime.js animation
            profileSection.style.display = 'block';
            anime({
                targets: '#profileSection',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 600,
                easing: 'easeOutQuad'
            });
            
            /**
             * Search History Management - Saves recent searches
             * @type {Array}
             */
            let history = JSON.parse(localStorage.getItem('githubSearchHistory')) || [];
            history = history.filter(item => item !== username); // Remove duplicates
            history.unshift(username); // Add to beginning (most recent first)
            localStorage.setItem('githubSearchHistory', JSON.stringify(history.slice(0, 5)));
            
        } catch (error) {
            // Error handling for network issues or invalid users
            alert('Error: ' + error.message);
        }
        
        // Reset button state after operation completion
        searchBtn.textContent = 'Search';
        searchBtn.disabled = false;
    }
});
