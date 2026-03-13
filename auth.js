import { createClient } from '@supabase/supabase-js';

// ─── Supabase config ────────────────────────────────────────
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
  currentUser = null;
  currentProfile = null;
  notifyListeners();

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
    // Профиль не найден — создаём
    const { data: newProfile, error: insertErr } = await supabase
      .from('profiles')
      .insert({ id: userId, full_name: '' })
      .select()
      .single();
    if (insertErr) {
      console.error('Profile insert error:', insertErr);
      return null;
    }
    return newProfile;
  }

  if (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
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

  if (error) {
    console.error('Orders fetch error:', error);
    return [];
  }
  return data || [];
}

// ─── Init ───────────────────────────────────────────────────

export async function initAuth() {
  // НЕ async callback — чтобы не блокировать signInWithPassword
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      currentUser = session.user;
      // Сразу обновляем UI с email (без ожидания профиля)
      notifyListeners();
      // Загружаем профиль в фоне
      fetchProfile(session.user.id).then((profile) => {
        currentProfile = profile;
        notifyListeners();
      });
    } else {
      currentUser = null;
      currentProfile = null;
      notifyListeners();
    }
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    currentUser = session.user;
    notifyListeners();
    fetchProfile(session.user.id).then((profile) => {
      currentProfile = profile;
      notifyListeners();
    });
  }
}
