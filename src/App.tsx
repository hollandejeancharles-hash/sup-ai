import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AuthSheetProvider } from "@/contexts/AuthSheetContext";
import { AuthSheetContainer } from "@/components/auth/AuthSheetContainer";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import AuthCallback from "./pages/AuthCallback";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Article from "./pages/Article";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Admin-only route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - accessible to everyone */}
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/article/:id" element={<Article />} />
      
      {/* Auth routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/admin/login" element={<AdminAuth />} />
      
      {/* Semi-protected routes - show content but prompt auth for actions */}
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Admin-only route */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AuthSheetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
            {/* Global Auth Sheet - appears as bottom sheet when needed */}
            <AuthSheetContainer />
          </BrowserRouter>
        </TooltipProvider>
      </AuthSheetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;