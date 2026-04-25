import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fieldService } from "@/lib/services/field.service";
import type { Field } from "@/types/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Map as MapIcon,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sprout,
  X,
  Loader2
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { BannerCarousel } from "@/components/BannerCarousel";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

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
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    // Check if user dismissed the tip
    const dismissed = localStorage.getItem('croplens_tip_dismissed');
    if (dismissed) setShowTip(false);

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
        toast.error("Failed to sync dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const dismissTip = () => {
    setShowTip(false);
    localStorage.setItem('croplens_tip_dismissed', 'true');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-20">
         <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Synchronizing Dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = stats ? [
    { name: 'Active', value: stats.fields_per_status.Active, color: '#3B82F6' },
    { name: 'At Risk', value: stats.fields_per_status['At Risk'], color: '#EF4444' },
    { name: 'Completed', value: stats.fields_per_status.Completed, color: '#16A34A' },
  ] : [];

  const stageData = stats ? Object.entries(stats.fields_per_stage).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <BannerCarousel userName={user?.name || "User"} role={user?.role || "agent"} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Fields"
          value={stats?.total_fields || 0}
          icon={MapIcon}
          trend="+2 this week"
          color="#16A34A"
        />
        <MetricCard
          title="Active Growth"
          value={stats?.fields_per_status?.Active || 0}
          icon={Timer}
          trend="In progress"
          color="#3B82F6"
        />
        <MetricCard
          title="At Risk"
          value={stats?.fields_per_status?.["At Risk"] || 0}
          icon={AlertTriangle}
          trend="Action required"
          color="#EF4444"
          isAlert={Boolean(stats?.fields_per_status?.["At Risk"])}
        />
        <MetricCard
          title="Completed"
          value={stats?.fields_per_status?.Completed || 0}
          icon={CheckCircle2}
          trend="Harvested"
          color="#10B981"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm ring-1 ring-black/5">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs font-bold">
              {chartData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-xl bg-card/60 backdrop-blur-sm ring-1 ring-black/5">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Growth Stages</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <RechartsTooltip
                  cursor={{ fill: '#88888810' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#16A34A" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl bg-card/60 backdrop-blur-sm ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-green" />
              Recent Field Activity
            </CardTitle>
            <Link
              to="/dashboard/fields"
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
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${field.status === 'At Risk' ? 'bg-destructive/10 text-destructive' : 'bg-brand-green/10 text-brand-green'
                        }`}>
                        <MapIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark dark:text-white group-hover:text-brand-green transition-colors">{field.name}</p>
                        <p className="text-xs font-medium text-muted-foreground">{field.crop_type} • {field.stage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${field.status === 'At Risk'
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
        <div className="space-y-6">
          {showTip && (
            <Card className="border-none shadow-xl bg-brand-dark text-white overflow-hidden relative animate-in slide-in-from-right-4 duration-500">
              <div className="absolute top-0 right-0 p-2 z-20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={dismissTip}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
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
          )}

          <Card className="border-none shadow-xl bg-gradient-to-br from-brand-green to-emerald-700 text-white p-6">
            <h3 className="text-lg font-bold mb-2">Field Agent Support</h3>
            <p className="text-white/80 text-sm mb-4">Need help with a specific field unit? Contact the system admin or check the manual.</p>
            <Button className="w-full bg-white text-brand-green hover:bg-white/90 font-bold rounded-xl h-11">
              View Guidelines
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, color, isAlert }: any) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-white/5 backdrop-blur-sm overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
            <h3 className={`text-3xl font-black text-brand-dark dark:text-white ${isAlert ? 'text-destructive animate-pulse' : ''}`}>{value}</h3>
          </div>
          <div
            className="p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color: color }} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[10px] font-bold text-muted-foreground/80 uppercase">{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}


