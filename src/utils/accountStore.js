const USERS_KEY = "community-compass-users-v1";
const SESSION_KEY = "community-compass-session-v1";

const encoder = new TextEncoder();

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function makeHandle(name, email) {
  const base = (name || email.split("@")[0] || "member")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);
  return base || "member";
}

async function hashPassword(email, password) {
  const data = encoder.encode(`${email.trim().toLowerCase()}::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

export function getLocalUsers() {
  return readJson(USERS_KEY, []);
}

export function getSessionUser() {
  const sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;
  return publicUser(getLocalUsers().find(user => user.id === sessionId));
}

export async function signupLocalAccount({ name, email, password, role, location, interests }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getLocalUsers();

  if (users.some(user => user.email === normalizedEmail)) {
    throw new Error("An account already exists for that email.");
  }

  const user = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    handle: makeHandle(name, normalizedEmail),
    passwordHash: await hashPassword(normalizedEmail, password),
    role: role || "Community Member",
    location: location || "Middletown, Delaware",
    bio: "Exploring local resources and community opportunities.",
    website: "",
    interests: interests?.length ? interests : ["Resources", "Events", "Volunteering"],
    avatarGradient: "linear-gradient(135deg, #0B1F3A, #1D9E75)",
    avatarImage: "/avatars/avatar-default.svg",
    bannerGradient: "linear-gradient(135deg, #0B1F3A, #1D9E75 58%, #EF9F27)",
    bannerImage: "",
    accentColor: "#1D9E75",
    emailVerified: false,
    verified: false,
    createdAt: new Date().toISOString(),
  };

  writeJson(USERS_KEY, [...users, user]);
  localStorage.setItem(SESSION_KEY, user.id);
  return publicUser(user);
}

export async function loginLocalAccount({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getLocalUsers();
  const user = users.find(account => account.email === normalizedEmail);

  if (!user || user.passwordHash !== await hashPassword(normalizedEmail, password)) {
    throw new Error("Invalid email or password.");
  }

  localStorage.setItem(SESSION_KEY, user.id);
  return publicUser(user);
}

export function logoutLocalAccount() {
  localStorage.removeItem(SESSION_KEY);
}

export function updateLocalProfile(nextProfile) {
  if (!nextProfile?.id) return null;
  const users = getLocalUsers();
  const existingUser = users.find(user => user.id === nextProfile.id);
  const updatedUser = {
    ...existingUser,
    ...nextProfile,
    passwordHash: existingUser?.passwordHash || "",
  };
  const updatedUsers = existingUser
    ? users.map(user => user.id === nextProfile.id ? updatedUser : user)
    : [...users, updatedUser];
  writeJson(USERS_KEY, updatedUsers);
  localStorage.setItem(SESSION_KEY, updatedUser.id);
  return publicUser(updatedUser);
}

export function verifyLocalAccount(userId) {
  const users = getLocalUsers();
  const existingUser = users.find(user => user.id === userId);
  if (!existingUser) return null;
  const updatedUsers = users.map(user => user.id === userId ? { ...user, emailVerified:true, verified:true } : user);
  writeJson(USERS_KEY, updatedUsers);
  return publicUser(updatedUsers.find(user => user.id === userId));
}
