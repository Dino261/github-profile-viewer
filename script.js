// Wait for the page to load before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const searchBtn = document.getElementById('searchBtn');
    const usernameInput = document.getElementById('usernameInput');
    const profileSection = document.getElementById('profileSection');

    // Check if elements exist (for contact.html page)
    if (searchBtn && usernameInput) {
        // When search button clicked
        searchBtn.addEventListener('click', searchUser);

        // Enter key support
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchUser();
        });
    }

    // Contact form handler for contact.html
    const contactForm = document.getElementById('contactForm') || 
                       document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage (simulating data file submission)
            let submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
            submissions.push(formData);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
            
            // Show success message
            alert('Thank you for your message! We have received your feedback and saved it successfully.');
            
            // Reset form
            this.reset();
            
            // Log to console for verification (for assessment)
            console.log('Form data saved:', formData);
            console.log('All submissions:', submissions);
        });
    }

    // Main search function
    async function searchUser() {
        const username = usernameInput.value.trim();
        
        if (username === '') {
            alert('Please enter username');
            return;
        }
        
        // Loading state
        searchBtn.textContent = 'Searching...';
        searchBtn.disabled = true;
        
        try {
            // Simplified: No headers, just basic fetch request
            const response = await fetch('https://api.github.com/users/' + username);
            
            if (!response.ok) throw new Error('User not found');
            
            const userData = await response.json();
            
            // Update profile
            document.getElementById('userLogin').textContent = '@' + userData.login;
            document.getElementById('userName').textContent = userData.name || 'No name';
            document.getElementById('userBio').textContent = userData.bio || 'No bio';
            document.getElementById('avatarImg').src = userData.avatar_url;
            document.getElementById('repoCount').textContent = userData.public_repos;
            document.getElementById('followerCount').textContent = userData.followers;
            document.getElementById('followingCount').textContent = userData.following;
            document.getElementById('githubLink').href = userData.html_url;
            
            // Show with animation
            profileSection.style.display = 'block';
            anime({
                targets: '#profileSection',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 600,
                easing: 'easeOutQuad'
            });
            
            // Save to history
            let history = JSON.parse(localStorage.getItem('githubSearchHistory')) || [];
            history = history.filter(item => item !== username);
            history.unshift(username);
            localStorage.setItem('githubSearchHistory', JSON.stringify(history.slice(0, 5)));
            
        } catch (error) {
            alert('Error: ' + error.message);
        }
        
        // Reset button
        searchBtn.textContent = 'Search';
        searchBtn.disabled = false;
    }
});