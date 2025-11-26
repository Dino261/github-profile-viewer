# Github Profile Viewer

A responsive web application that searches and displays GitHub user profiles using the GitHub API. Features real-time data, smooth animations, and local storage for contact form submissions.
# Features

-Search GitHub Users: Look up any public GitHub username.
-Profie Information: View avatar, name, bio, repository count, followers, and following statistics.
-Real-Time Data: Fetches live data from Github API.
-Responsive Design: Works perfectly on desktop, tablet, and mobile
-Smooth Animation: Smooth transitios using Anime.js
-Contact Form: Functional form with local storage.

# Technologies Used

-HTML, CSS, and JavaScript
-GirHbu REST API
-Anime.js
-LocalStorage for data persistence
Custom CSS with responsive breakpoints.

# File Structure

github-profile-viewer/
├── index.html # Main application
├── contact.html # Contact and about page
├── style.css # Complete styling
├── script.js # Application logic
├── config.js # API configuration
├── README.md # This file

# Quick Start

1-  **Clone the repository**

   git clone https://github.com/YOUR_USERNAME/github-profile-viewer.git
   cd github-profile-viewer

2- Open In browser
-open index.html in your web browser
-No build process or server required

3- Start Searching
-Enter any GitHub username
-View profile information and statistics.
-Use the contact form to send messages(saved to browser storage)

API Usage

-This app uses GitHub's public API without authentication

Rate Limits:
-60 requests per hour per IP address
-Perfect for demo and portfolio use
