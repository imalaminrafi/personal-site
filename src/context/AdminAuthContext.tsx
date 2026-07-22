import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "ar_admin";
const SESSION_KEY = "ar_admin_session";

const DEFAULT_EMAIL = "admin@alaminrafi.com";
const DEFAULT_PASSWORD = "Admin@12345";

async function hash(str: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface AdminUser {
  email: string;
  passwordHash: string;
  name: string;
  mustChangePassword: boolean;
}

interface AdminSession {
  email: string;
  loginAt: number;
}

interface AdminAuthContextType {
  admin: AdminSession | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; mustChange?: boolean; error?: string }>;
  logout: () => void;
  changePassword: (current: string, newPass: string) => Promise<{ ok: boolean; error?: string }>;
  isReady: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

function loadAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAdmin(u: AdminUser) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(u));
}

function loadSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(s: AdminSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = loadSession();
    if (stored) setAdmin(stored);
    setIsReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    let stored = loadAdmin();
    if (!stored) {
      const hashPass = await hash(DEFAULT_PASSWORD);
      stored = { email: DEFAULT_EMAIL, passwordHash: hashPass, name: "Admin", mustChangePassword: true };
      saveAdmin(stored);
    }

    if (email.toLowerCase() !== stored.email.toLowerCase()) {
      return { ok: false, error: "Invalid email or password." };
    }

    const passHash = await hash(password);
    if (passHash !== stored.passwordHash) {
      return { ok: false, error: "Invalid email or password." };
    }

    const session: AdminSession = { email: stored.email, loginAt: Date.now() };
    saveSession(session);
    setAdmin(session);

    if (stored.mustChangePassword) {
      return { ok: true, mustChange: true };
    }
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAdmin(null);
  }, []);

  const changePassword = useCallback(async (current: string, newPass: string) => {
    const stored = loadAdmin();
    if (!stored) return { ok: false, error: "No admin found." };

    const curHash = await hash(current);
    if (curHash !== stored.passwordHash) {
      return { ok: false, error: "Current password is incorrect." };
    }
    if (newPass.length < 6) {
      return { ok: false, error: "New password must be at least 6 characters." };
    }

    stored.passwordHash = await hash(newPass);
    stored.mustChangePassword = false;
    saveAdmin(stored);
    return { ok: true };
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, changePassword, isReady }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
