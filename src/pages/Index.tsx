import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Index redirects to landing or home based on auth state
export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If logged in, go to home; otherwise go to landing
  return <Navigate to={user ? "/home" : "/landing"} replace />;
}