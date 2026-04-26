"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-background">
      {/* Dynamic Background Patterns */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-green/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-dark/30 blur-[120px]" />
      
      <Card className="w-full max-w-md border-white/20 bg-white/70 dark:bg-brand-dark/40 backdrop-blur-xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto bg-brand-green/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-brand-green/20">
            <Sprout className="w-10 h-10 text-brand-green" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-brand-dark dark:text-white">
            Crop<span className="text-brand-green">Lens</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Smart Season Field Monitoring System
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm font-medium rounded-lg bg-destructive/10 text-destructive border border-destructive/20 animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@test.com"
                  className="pl-10 h-11 bg-white/50 dark:bg-black/20 border-white/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-white/50 dark:bg-black/20 border-white/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-4 flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full h-11 bg-brand-button hover:bg-brand-button/90 text-white font-semibold transition-all duration-300 shadow-lg shadow-brand-green/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="w-full space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-muted-foreground font-medium">Demo Credentials</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 text-[10px] uppercase tracking-wider font-bold border-brand-green/30 hover:bg-brand-green/10 hover:text-brand-green"
                  onClick={() => {
                    setEmail("admin@test.com");
                    setPassword("password");
                  }}
                >
                  Login as Admin
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 text-[10px] uppercase tracking-wider font-bold border-brand-green/30 hover:bg-brand-green/10 hover:text-brand-green"
                  onClick={() => {
                    setEmail("agent@test.com");
                    setPassword("password");
                  }}
                >
                  Login as Agent
                </Button>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By signing in, you agree to the CropLens terms of service.
            </p>
          </CardFooter>
        </form>
      </Card>
      
      {/* Decorative footer element */}
      <div className="absolute bottom-8 text-sm text-muted-foreground/60 font-medium tracking-widest uppercase">
        © 2026 CropLens Systems
      </div>
    </div>
  );
}
