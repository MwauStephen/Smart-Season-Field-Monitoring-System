"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fieldService, Field } from "@/lib/services/field.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Map as MapIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Timer, 
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sprout
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import api from "@/lib/api";

interface Stats {
  total_fields: number;
  fields_per_status: {
    Active: number;
    "At Risk": number;
    Completed: number;
  };
  fields_per_stage: Record<string, number>;
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentFields, setRecentFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, fieldsRes] = await Promise.all([
          api.get<Stats>("/dashboard/stats"),
          fieldService.getAllFields()
        ]);
        setStats(statsRes.data);
        setRecentFields(fieldsRes.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-dark">
            Welcome back, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Here's what's happening with your fields today.
          </p>
        </div>
        {isAdmin && (
          <Link 
            href="/dashboard/fields" 
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-brand-green hover:bg-brand-green/90 shadow-md h-11 px-4 flex items-center justify-center rounded-lg font-semibold transition-all duration-300"
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Field
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Fields" 
          value={stats?.total_fields || 0} 
          icon={MapIcon} 
          trend="+2 this week"
          color="brand-green"
        />
        <MetricCard 
          title="Active Growth" 
          value={stats?.fields_per_status.Active || 0} 
          icon={Timer} 
          trend="In progress"
          color="blue-500"
        />
        <MetricCard 
          title="At Risk" 
          value={stats?.fields_per_status["At Risk"] || 0} 
          icon={AlertTriangle} 
          trend="Action required"
          color="destructive"
          isAlert={Boolean(stats?.fields_per_status["At Risk"])}
        />
        <MetricCard 
          title="Completed" 
          value={stats?.fields_per_status.Completed || 0} 
          icon={CheckCircle2} 
          trend="Harvested"
          color="emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Fields Table/List */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-white/60 backdrop-blur-sm ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-green" />
              Recent Field Activity
            </CardTitle>
            <Link 
              href="/dashboard/fields" 
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-brand-green font-semibold flex items-center"
              )}
            >
              View All <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {recentFields.length > 0 ? (
                recentFields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        field.status === 'At Risk' ? 'bg-destructive/10 text-destructive' : 'bg-brand-green/10 text-brand-green'
                      }`}>
                        <MapIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark group-hover:text-brand-green transition-colors">{field.name}</p>
                        <p className="text-xs font-medium text-muted-foreground">{field.crop_type} • {field.stage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${
                        field.status === 'At Risk' 
                          ? 'bg-destructive/10 text-destructive ring-destructive/20' 
                          : field.status === 'Completed'
                            ? 'bg-blue-100 text-blue-700 ring-blue-700/10'
                            : 'bg-green-100 text-green-700 ring-green-700/10'
                      }`}>
                        {field.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center space-y-2">
                  <p className="text-muted-foreground font-medium">No fields found.</p>
                  {isAdmin && <p className="text-xs">Start by adding your first field.</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Info Card */}
        <Card className="border-none shadow-xl bg-brand-dark text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sprout className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg">Crop Status Tip</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <p className="text-white/80 text-sm leading-relaxed">
              Fields that haven't been updated for over 7 days are automatically marked as <span className="text-red-400 font-bold">At Risk</span>. 
              Ensure your agents log progress weekly.
            </p>
            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">Seasonal Status</p>
              <p className="text-xl font-bold">Optimal Growth</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, color, isAlert }: any) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
            <h3 className={`text-3xl font-black text-brand-dark ${isAlert ? 'text-destructive animate-pulse' : ''}`}>{value}</h3>
          </div>
          <div className={`p-3 rounded-2xl bg-${color}/10 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full bg-${color}`} />
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase">{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}
