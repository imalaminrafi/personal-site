import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#070711] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) return <Navigate to="/admin" replace />;

  return <>{children}</>;
}
