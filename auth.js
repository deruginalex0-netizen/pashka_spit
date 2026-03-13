import { createClient } from '@supabase/supabase-js';

// ─── Supabase config ────────────────────────────────────────
// ВАЖНО: замените на реальные значения из вашего проекта Supabase
const SUPABASE_URL = 'https://ttxwccansmhwgnqwxgjz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0eHdjY2Fuc21od2ducXd4Z2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDMxMTYsImV4cCI6MjA4ODk3OTExNn0.Eau-tm7Jjj0Z-p5SwP-4hgXwbwm8RScbZLQ3gPz5V7E';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── State ──────────────────────────────────────────────────
let currentUser = null;
let currentProfile = null;
let authListeners = [];

// ─── Public API ─────────────────────────────────────────────

export function getSupabase() {
  return supabase;
}

export function getCurrentUser() {
  return currentUser;
}

export function getCurrentProfile() {
  return currentProfile;
}

export function onAuthChange(callback) {
  authListeners.push(callback);
  return () => {
    authListeners = authListeners.filter((cb) => cb !== callback);
  };
}

function notifyListeners() {
  authListeners.forEach((cb) => cb(currentUser, currentProfile));
}

// ─── Auth methods ───────────────────────────────────────────

export async function signUpWithEmail({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  // Сначала чистим локальное состояние — UI обновится сразу
  currentUser = null;
  currentProfile = null;
  notifyListeners();

  // Потом пытаемся разлогиниться на сервере (scope: 'local' не шлёт запрос на сервер)
  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch (err) {
    console.error('signOut error:', err);
  }
}

// ─── Profile ────────────────────────────────────────────────

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // Профиль не найден — создаём (триггер мог не сработать)
    const { data: newProfile, error: insertErr } = await supabase
      .from('profiles')
      .insert({ id: userId, full_name: '' })
      .select()
      .single();
    if (insertErr) throw insertErr;
    return newProfile;
  }

  if (error) throw error;
  return data;
}

export async function updateProfile(updates) {
  if (!currentUser) throw new Error('Пользователь не авторизован');

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentUser.id)
    .select()
    .single();

  if (error) throw error;
  currentProfile = data;
  notifyListeners();
  return data;
}

// ─── Orders ─────────────────────────────────────────────────

export async function fetchOrders() {
  if (!currentUser) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ─── Init ───────────────────────────────────────────────────

export async function initAuth() {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      currentUser = session.user;
      try {
        currentProfile = await fetchProfile(session.user.id);
      } catch {
        currentProfile = null;
      }
    } else {
      currentUser = null;
      currentProfile = null;
    }
    notifyListeners();
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    currentUser = session.user;
    try {
      currentProfile = await fetchProfile(session.user.id);
    } catch {
      currentProfile = null;
    }
    notifyListeners();
  }
}
