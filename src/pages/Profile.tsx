import { useState, useEffect } from "react";
import { LogOut, Bell, Mail, Info, ChevronRight, Crown, LogIn } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthSheet } from "@/contexts/AuthSheetContext";
import { useNavigate } from "react-router-dom";
import { useProtectedAction } from "@/hooks/useProtectedAction";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { openAuthSheet } = useAuthSheet();
  const { executeProtected } = useProtectedAction();
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/home");
  };

  // Prompt auth when trying to toggle notifications without being logged in
  const handleEmailToggle = (checked: boolean) => {
    executeProtected(
      () => setEmailNotifications(checked),
      { actionType: "notifications", actionLabel: "gérer tes notifications" }
    );
  };

  const handlePushToggle = (checked: boolean) => {
    executeProtected(
      () => setPushNotifications(checked),
      { actionType: "notifications", actionLabel: "activer les notifications push" }
    );
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  // Not logged in state
  if (!user) {
    return (
      <>
        <MobileContainer>
          <header className="pt-6 pb-6">
            <h1 className="text-h1 text-foreground mb-6">Profile</h1>

            {/* Guest state */}
            <div className="flex flex-col items-center py-8">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <LogIn className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-h2 text-foreground mb-2">Bienvenue</h2>
              <p className="text-body text-muted-foreground text-center max-w-xs mb-6">
                Connecte-toi pour sauvegarder tes articles et gérer tes préférences.
              </p>
              <Button
                onClick={() => openAuthSheet()}
                className="rounded-full h-12 px-8 text-body font-semibold"
              >
                Se connecter
              </Button>
            </div>
          </header>

          {/* About Card (visible to all) */}
          <section className="mb-4">
            <button className="w-full bg-card rounded-card shadow-card p-5 flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Info className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-body font-semibold text-foreground">
                  About & Legal
                </h3>
                <p className="text-meta text-muted-foreground">
                  Terms, privacy, version
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </section>
        </MobileContainer>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <MobileContainer>
        {/* Header */}
        <header className="pt-6 pb-6">
          <h1 className="text-h1 text-foreground mb-6">Profile</h1>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">
                {getInitials()}
              </span>
            </div>
            <div>
              <p className="text-body font-semibold text-foreground">
                {user?.email || "user@example.com"}
              </p>
              <p className="text-meta text-muted-foreground">Free plan</p>
            </div>
          </div>
        </header>

        {/* Notifications Card */}
        <section className="mb-4">
          <div className="bg-card rounded-card shadow-card p-5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-body font-semibold text-foreground">
                Notifications
              </h2>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-body text-foreground">Email</span>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={handleEmailToggle}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="text-body text-foreground">Push</span>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={handlePushToggle}
              />
            </div>
          </div>
        </section>

        {/* Upgrade Card */}
        <section className="mb-4">
          <button className="w-full bg-card rounded-card shadow-card p-5 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-body font-semibold text-foreground">
                Upgrade to Pro
              </h3>
              <p className="text-meta text-muted-foreground">
                Get unlimited access
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </section>

        {/* About Card */}
        <section className="mb-4">
          <button className="w-full bg-card rounded-card shadow-card p-5 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Info className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-body font-semibold text-foreground">
                About & Legal
              </h3>
              <p className="text-meta text-muted-foreground">
                Terms, privacy, version
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </section>

        {/* Sign Out */}
        <section>
          <button
            onClick={handleSignOut}
            className="w-full bg-card rounded-card shadow-card p-5 flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            <span className="text-body font-semibold text-destructive">
              Se déconnecter
            </span>
          </button>
        </section>
      </MobileContainer>
      <BottomNav />
    </>
  );
}