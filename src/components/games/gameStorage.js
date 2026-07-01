const USERNAME_KEY = "sv_arcade_username";

export function loadUsername() {
  try {
    return localStorage.getItem(USERNAME_KEY) || "";
  } catch {
    return "";
  }
}

export function saveUsername(name) {
  try {
    localStorage.setItem(USERNAME_KEY, name);
  } catch {}
}

export function loadLeaderboard(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

// Reads localStorage fresh (not from React state) and writes synchronously —
// keeps this out of any setState updater, where React's Strict Mode can
// double-invoke and silently double-save.
export function pushScore(key, name, score, max = 5) {
  const next = [...loadLeaderboard(key), { name, score }]
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
  saveLeaderboard(key, next);
  return next;
}
