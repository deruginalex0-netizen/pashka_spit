import {
  getCurrentUser,
  getCurrentProfile,
  onAuthChange,
  signUpWithEmail,
  signInWithEmail,
  signOut,
  updateProfile,
  fetchOrders,
} from './auth.js';

// ─── DOM refs ───────────────────────────────────────────────

const els = {
  authBtn: () => document.getElementById('auth-btn'),
  authBtnLabel: () => document.getElementById('auth-btn-label'),

  authModal: () => document.getElementById('auth-modal'),
  closeAuthModal: () => document.getElementById('close-auth-modal'),

  loginTab: () => document.getElementById('auth-tab-login'),
  registerTab: () => document.getElementById('auth-tab-register'),
  loginForm: () => document.getElementById('login-form'),
  registerForm: () => document.getElementById('register-form'),

  loginEmail: () => document.getElementById('login-email'),
  loginPassword: () => document.getElementById('login-password'),
  loginError: () => document.getElementById('login-error'),
  loginSubmit: () => document.getElementById('login-submit'),

  registerName: () => document.getElementById('register-name'),
  registerEmail: () => document.getElementById('register-email'),
  registerPassword: () => document.getElementById('register-password'),
  registerPasswordConfirm: () => document.getElementById('register-password-confirm'),
  registerError: () => document.getElementById('register-error'),
  registerSubmit: () => document.getElementById('register-submit'),

  accountModal: () => document.getElementById('account-modal'),
  closeAccountModal: () => document.getElementById('close-account-modal'),
  accountName: () => document.getElementById('account-name'),
  accountEmail: () => document.getElementById('account-email'),
  accountTelegram: () => document.getElementById('account-telegram'),
  accountSave: () => document.getElementById('account-save'),
  accountError: () => document.getElementById('account-error'),
  accountLogout: () => document.getElementById('account-logout'),
  ordersList: () => document.getElementById('orders-list'),
};

// ─── Auth modal ─────────────────────────────────────────────

function openAuthModal() {
  const modal = els.authModal();
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  switchAuthTab('login');
}

function closeAuthModal() {
  const modal = els.authModal();
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  clearAuthErrors();
}

function switchAuthTab(tab) {
  const loginTab = els.loginTab();
  const registerTab = els.registerTab();
  const loginForm = els.loginForm();
  const registerForm = els.registerForm();

  if (tab === 'login') {
    loginTab?.classList.add('is-active');
    registerTab?.classList.remove('is-active');
    loginForm?.classList.add('is-active');
    registerForm?.classList.remove('is-active');
  } else {
    loginTab?.classList.remove('is-active');
    registerTab?.classList.add('is-active');
    loginForm?.classList.remove('is-active');
    registerForm?.classList.add('is-active');
  }
}

function clearAuthErrors() {
  const loginErr = els.loginError();
  const regErr = els.registerError();
  if (loginErr) loginErr.textContent = '';
  if (regErr) regErr.textContent = '';
}

// ─── Account modal ──────────────────────────────────────────

function openAccountModal() {
  const modal = els.accountModal();
  if (!modal) return;

  fillProfileFields();
  loadOrderHistory();

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeAccountModal() {
  const modal = els.accountModal();
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

function fillProfileFields() {
  const profile = getCurrentProfile();
  const user = getCurrentUser();

  const nameEl = els.accountName();
  const emailEl = els.accountEmail();
  const telegramEl = els.accountTelegram();

  if (nameEl) nameEl.value = profile?.full_name || '';
  if (emailEl) emailEl.value = user?.email || '';
  if (telegramEl) telegramEl.value = profile?.telegram_username || '';
}

async function loadOrderHistory() {
  const list = els.ordersList();
  if (!list) return;

  list.innerHTML = '<li class="orders-loading">Загрузка...</li>';

  try {
    const orders = await fetchOrders();

    if (orders.length === 0) {
      list.innerHTML = '<li class="orders-empty">У вас пока нет заказов</li>';
      return;
    }

    list.innerHTML = orders
      .map((order) => {
        const date = new Date(order.created_at).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        const statusLabels = {
          pending: 'Ожидает',
          delivered: 'Доставлен',
          expired: 'Истёк',
        };
        const statusLabel = statusLabels[order.status] || order.status;
        const photoCount = order.photo_ids?.length || 0;

        return `
          <li class="order-card">
            <div class="order-card__header">
              <span class="order-card__date">${date}</span>
              <span class="order-card__status order-card__status--${order.status}">${statusLabel}</span>
            </div>
            <div class="order-card__body">
              <span class="order-card__photos">${photoCount} фото</span>
              <span class="order-card__price">${order.total_price} ₽</span>
            </div>
          </li>
        `;
      })
      .join('');
  } catch {
    list.innerHTML = '<li class="orders-empty">Ошибка загрузки заказов</li>';
  }
}

// ─── Login handler ──────────────────────────────────────────

async function handleLogin(event) {
  event.preventDefault();
  const emailEl = els.loginEmail();
  const passwordEl = els.loginPassword();
  const errorEl = els.loginError();
  const submitEl = els.loginSubmit();

  const email = emailEl?.value.trim();
  const password = passwordEl?.value;

  if (!email || !password) {
    if (errorEl) errorEl.textContent = 'Заполните все поля.';
    return;
  }

  if (submitEl) {
    submitEl.disabled = true;
    submitEl.textContent = 'Вход...';
  }

  try {
    await signInWithEmail({ email, password });
    closeAuthModal();
  } catch (err) {
    if (errorEl) errorEl.textContent = translateAuthError(err.message);
  } finally {
    if (submitEl) {
      submitEl.disabled = false;
      submitEl.textContent = 'Войти';
    }
  }
}

// ─── Register handler ───────────────────────────────────────

async function handleRegister(event) {
  event.preventDefault();
  const nameEl = els.registerName();
  const emailEl = els.registerEmail();
  const passwordEl = els.registerPassword();
  const confirmEl = els.registerPasswordConfirm();
  const errorEl = els.registerError();
  const submitEl = els.registerSubmit();

  const fullName = nameEl?.value.trim();
  const email = emailEl?.value.trim();
  const password = passwordEl?.value;
  const confirm = confirmEl?.value;

  if (!fullName || !email || !password || !confirm) {
    if (errorEl) errorEl.textContent = 'Заполните все поля.';
    return;
  }

  if (password.length < 6) {
    if (errorEl) errorEl.textContent = 'Пароль должен быть не менее 6 символов.';
    return;
  }

  if (password !== confirm) {
    if (errorEl) errorEl.textContent = 'Пароли не совпадают.';
    return;
  }

  if (submitEl) {
    submitEl.disabled = true;
    submitEl.textContent = 'Регистрация...';
  }

  try {
    await signUpWithEmail({ email, password, fullName });
    if (errorEl) {
      errorEl.style.color = 'var(--paper-stamp)';
      errorEl.textContent = 'Проверьте почту для подтверждения регистрации.';
    }
  } catch (err) {
    if (errorEl) {
      errorEl.style.color = '';
      errorEl.textContent = translateAuthError(err.message);
    }
  } finally {
    if (submitEl) {
      submitEl.disabled = false;
      submitEl.textContent = 'Зарегистрироваться';
    }
  }
}

// ─── Profile save ───────────────────────────────────────────

async function handleProfileSave() {
  const nameEl = els.accountName();
  const telegramEl = els.accountTelegram();
  const errorEl = els.accountError();
  const saveBtn = els.accountSave();

  const fullName = nameEl?.value.trim();
  const telegramUsername = telegramEl?.value.trim().replace(/^@/, '');

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Сохранение...';
  }

  try {
    await updateProfile({ full_name: fullName, telegram_username: telegramUsername });
    if (errorEl) {
      errorEl.style.color = 'var(--paper-stamp)';
      errorEl.textContent = 'Сохранено!';
      setTimeout(() => {
        errorEl.textContent = '';
      }, 2000);
    }
  } catch (err) {
    if (errorEl) {
      errorEl.style.color = '';
      errorEl.textContent = err.message || 'Ошибка сохранения.';
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Сохранить';
    }
  }
}

// ─── Auth state → UI ────────────────────────────────────────

function updateAuthUI(user, profile) {
  const btn = els.authBtn();
  const label = els.authBtnLabel();
  if (!btn || !label) return;

  if (user) {
    const displayName = profile?.full_name || user.email?.split('@')[0] || 'Кабинет';
    label.textContent = displayName;
    btn.classList.add('is-logged-in');
  } else {
    label.textContent = 'Войти';
    btn.classList.remove('is-logged-in');
  }
}

// ─── Error translation ──────────────────────────────────────

function translateAuthError(message) {
  const map = {
    'Invalid login credentials': 'Неверный email или пароль.',
    'Email not confirmed': 'Подтвердите email перед входом.',
    'User already registered': 'Пользователь с таким email уже зарегистрирован.',
    'Password should be at least 6 characters': 'Пароль должен быть не менее 6 символов.',
    'Unable to validate email address: invalid format': 'Некорректный формат email.',
  };
  return map[message] || message || 'Произошла ошибка.';
}

// ─── Bind events ────────────────────────────────────────────

export function initAccountUI() {
  // Auth button → open auth or account modal
  els.authBtn()?.addEventListener('click', () => {
    if (getCurrentUser()) {
      openAccountModal();
    } else {
      openAuthModal();
    }
  });

  // Close modals
  els.closeAuthModal()?.addEventListener('click', closeAuthModal);
  els.authModal()?.addEventListener('click', (e) => {
    if (e.target === els.authModal()) closeAuthModal();
  });

  els.closeAccountModal()?.addEventListener('click', closeAccountModal);
  els.accountModal()?.addEventListener('click', (e) => {
    if (e.target === els.accountModal()) closeAccountModal();
  });

  // Tab switching
  els.loginTab()?.addEventListener('click', () => switchAuthTab('login'));
  els.registerTab()?.addEventListener('click', () => switchAuthTab('register'));

  // Forms
  els.loginForm()?.addEventListener('submit', handleLogin);
  els.registerForm()?.addEventListener('submit', handleRegister);

  // Profile save
  els.accountSave()?.addEventListener('click', handleProfileSave);

  // Logout
  els.accountLogout()?.addEventListener('click', async () => {
    await signOut();
    closeAccountModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAuthModal();
    closeAccountModal();
  });

  // Listen for auth state changes
  onAuthChange(updateAuthUI);

  // Set initial UI state
  updateAuthUI(getCurrentUser(), getCurrentProfile());
}

// Export for use in script.js (prefilling order form)
export { getCurrentUser as getUser, getCurrentProfile as getProfile };
