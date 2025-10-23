import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Check if email is authorized before allowing signup
        const { data: authorizedData, error: authCheckError } = await supabase
          .from("authorized_users")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        if (authCheckError) {
          toast.error("Error checking authorization. Please try again.");
          setLoading(false);
          return;
        }

        if (!authorizedData) {
          toast.error("This email is not authorized to create an account. Please contact an administrator.");
          setLoading(false);
          return;
        }

        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          // Check if user already exists
          if (error.message.includes("already registered") || error.message.includes("User already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
          return;
        }

        if (data.user) {
          // Check user role to redirect appropriately
          const { data: userData } = await supabase
            .from("authorized_users")
            .select("role")
            .eq("email", email)
            .single();

          toast.success("Account created! Please check your email to verify your account.");
          
          if (userData?.role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        if (data.user) {
          // Check user role to redirect appropriately
          const { data: userData } = await supabase
            .from("authorized_users")
            .select("role")
            .eq("email", email)
            .single();

          toast.success("Login successful!");
          
          if (userData?.role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      toast.error(isSignUp ? "Sign up failed. Please try again." : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Create Account" : "Login"}</CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Create an account to like and interact with images" 
              : "Sign in to like and interact with images"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              {isSignUp && (
                <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? (isSignUp ? "Creating account..." : "Signing in...") 
                : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-600 hover:text-emerald-700 underline"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Create one"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;