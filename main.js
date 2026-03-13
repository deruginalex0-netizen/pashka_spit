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

// Init auth and account UI
async function bootstrap() {
  try {
    await initAuth();
  } catch (err) {
    console.error('Auth init failed:', err);
  }
  initAccountUI();
}

bootstrap();
