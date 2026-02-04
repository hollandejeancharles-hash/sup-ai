import { useState } from "react";
import { LogOut, Bell, Mail, Info, ChevronRight, Crown } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

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
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="text-body text-foreground">Push</span>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
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
