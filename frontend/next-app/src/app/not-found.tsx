"use client"

import Link from "next/link";
import { MoveLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="m12 10 4 2-4 2-4-2Z" />
                <path d="m16.2 15.4 1.8 1.1c.3.2.3.6.1.9l-2.4 3.7c-.2.3-.6.4-.9.2l-1.8-1.1" />
                <path d="M12 22V14" />
                <path d="m7.8 15.4-1.8 1.1c-.3.2-.3.6-.1.9l2.4 3.7c.2.3.6.4.9.2l1.8-1.1" />
                <path d="M12 2a5 5 0 0 0-5 5v3l5 2 5-2V7a5 5 0 0 0-5-5Z" />
             </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Crop<span className="text-brand-green">Lens</span>
          </span>
        </div>

        <div className="space-y-4">
          <div className="relative inline-block">
            <h1 className="text-9xl font-black text-brand-green/10">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <HelpCircle className="w-12 h-12 text-brand-green" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Field Lost in the Fog</h2>
          <p className="text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist or has been moved to a different sector. 
            Don't worry, your crops are still safe!
          </p>
        </div>

        <div className="pt-4">
          <Button 
            render={
              <Link href="/dashboard">
                <MoveLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
            }
            className="bg-brand-green hover:bg-brand-green/90 text-white shadow-lg shadow-brand-green/20 h-12 px-8 rounded-xl font-bold group"
          />
        </div>

        <div className="pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            If you believe this is a technical error, please contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
