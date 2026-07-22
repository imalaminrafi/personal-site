import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "ar_admin_users";
const SESSION_KEY = "ar_admin_session";
const REMEMBER_KEY = "ar_admin_remember";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "superadmin";
}

interface StoredAdmin extends AdminUser {
  passwordHash: string;
  mustChangePassword: boolean;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<{ ok: boolean; error?: string; mustChangePassword?: boolean }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "ar_admin_salt_2026");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function generateToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getStoredAdmins(): StoredAdmin[] {
  try { return JSON.parse(localStorage.getItem(ADMIN_KEY) || "[]"); }
  catch { return []; }
}

function saveStoredAdmins(admins: StoredAdmin[]) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admins));
}

function getSession(): { admin: AdminUser; token: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setSession(admin: AdminUser, token: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ admin, token }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getRememberedEmail(): string {
  try { return localStorage.getItem(REMEMBER_KEY) || ""; }
  catch { return ""; }
}

function setRememberedEmail(email: string) {
  if (email) localStorage.setItem(REMEMBER_KEY, email);
  else localStorage.removeItem(REMEMBER_KEY);
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = getStoredAdmins();
      if (stored.length === 0) {
        const hash = await hashPassword("Admin@12345");
        const defaultAdmin: StoredAdmin = {
          id: "admin-001",
          email: "admin@alaminrafi.com",
          name: "Alamin Rafi",
          role: "superadmin",
          passwordHash: hash,
          mustChangePassword: true,
        };
        saveStoredAdmins([defaultAdmin]);
      }
      const session = getSession();
      if (session) {
        const found = getStoredAdmins().find(a => a.id === session.admin.id);
        if (found) {
          setAdmin(session.admin);
        } else {
          clearSession();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string, remember?: boolean): Promise<{ ok: boolean; error?: string; mustChangePassword?: boolean }> => {
    const admins = getStoredAdmins();
    const found = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!found) return { ok: false, error: "Invalid email or password." };

    const hash = await hashPassword(password);
    if (hash !== found.passwordHash) return { ok: false, error: "Invalid email or password." };

    const { passwordHash: _, ...safeAdmin } = found;
    setAdmin(safeAdmin);

    if (remember) setRememberedEmail(email);
    else setRememberedEmail("");

    const token = generateToken();
    setSession(safeAdmin, token);

    if (found.mustChangePassword) {
      return { ok: true, mustChangePassword: true };
    }

    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    clearSession();
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<{ ok: boolean; error?: string }> => {
    if (!admin) return { ok: false, error: "Not authenticated." };
    if (newPassword.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

    const admins = getStoredAdmins();
    const idx = admins.findIndex(a => a.id === admin.id);
    if (idx === -1) return { ok: false, error: "Admin not found." };

    const currentHash = await hashPassword(currentPassword);
    if (currentHash !== admins[idx].passwordHash) {
      return { ok: false, error: "Current password is incorrect." };
    }

    const newHash = await hashPassword(newPassword);
    admins[idx].passwordHash = newHash;
    admins[idx].mustChangePassword = false;
    saveStoredAdmins(admins);

    const token = generateToken();
    setSession(admin, token);

    return { ok: true };
  }, [admin]);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, changePassword, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export { getRememberedEmail };
