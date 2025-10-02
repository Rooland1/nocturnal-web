// auth.js - User authentication using localStorage

function isLoggedIn() {
  return localStorage.getItem('user') !== null;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user'));
}

function logout() {
  localStorage.removeItem('user');
  window.location.reload();
}

// Update profile link based on login status
function updateProfileLink() {
  const profileLink = document.getElementById('profileLink');
  if (profileLink) {
    if (isLoggedIn()) {
      profileLink.href = 'profile.html';
    } else {
      profileLink.setAttribute('data-bs-toggle', 'modal');
      profileLink.setAttribute('data-bs-target', '#loginModal');
    }
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', updateProfileLink);
