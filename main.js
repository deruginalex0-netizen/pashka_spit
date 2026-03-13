import { initAuth, getCurrentUser, getCurrentProfile, onAuthChange } from './auth.js';
import { initAccountUI } from './account.js';
import { init as initApp } from './script.js';

// Expose auth helpers globally so script.js can use them
window.__auth = {
  getCurrentUser,
  getCurrentProfile,
  onAuthChange,
};

// Init gallery app (was previously auto-called in script.js)
initApp();

// Init account UI immediately so buttons work
initAccountUI();

// Init auth in background (will update UI when ready)
initAuth().catch((err) => console.error('Auth init failed:', err));
