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

// Update user data in localStorage
function updateUser(updatedUser) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const index = users.findIndex(u => u.username === updatedUser.username);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', updateProfileLink);
