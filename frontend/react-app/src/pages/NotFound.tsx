import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-green/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-dark/20 blur-[120px]" />

      <div className="text-center relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto bg-brand-green/10 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 ring-1 ring-brand-green/20">
          <Sprout className="w-12 h-12 text-brand-green" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-8xl font-black text-brand-dark dark:text-white tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-muted-foreground">Field Lost in the Fog</h2>
          <p className="text-muted-foreground max-w-md mx-auto font-medium">
            It seems you've wandered into an unmapped sector. Don't worry, your crops are still safe!
          </p>
        </div>

        <div className="pt-4">
          <Link to="/dashboard">
            <Button className="bg-brand-green hover:bg-brand-green/90 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-brand-green/20">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase opacity-50">
          CropLens Systems • 2026
        </p>
      </div>
    </div>
  );
}
