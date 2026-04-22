"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/lib/services/user.service";
import { User } from "@/types/auth";
import { 
  Plus, 
  Users, 
  ShieldCheck, 
  UserCircle, 
  Mail, 
  Calendar,
  Search,
  MoreHorizontal
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function UsersPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  interface NewUser {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string | null;
  }

  // Create User State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "agent",
  });

  const fetchData = async () => {
    try {
      const [admins, agents] = await Promise.all([
        userService.getAdmins(),
        userService.getAgents()
      ]);
      setUsers([...admins, ...agents]);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.role) return;
    try {
      await userService.createNewUser({
        ...newUser,
        role: newUser.role as string
      });
      setIsCreateOpen(false);
      setNewUser({ name: "", email: "", password: "", password_confirmation: "", role: "agent" });
      fetchData();
    } catch (error) {
      console.error("Failed to create user", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ShieldCheck className="w-16 h-16 text-destructive/20" />
        <h2 className="text-2xl font-bold text-brand-dark">Access Restricted</h2>
        <p className="text-muted-foreground">Only system administrators can manage users.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-dark">User Management</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Manage system access for administrators and field agents.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger 
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-brand-green hover:bg-brand-green/90 shadow-md"
            )}
          >
            <Plus className="w-4 h-4 mr-2" /> Add New User
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateUser}>
              <DialogHeader>
                <DialogTitle>Create Account</DialogTitle>
                <DialogDescription>
                  Register a new user and assign them a system role.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select value={newUser.role} onValueChange={(val) => setNewUser(prev => ({ ...prev, role: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="agent">Field Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass">Password</Label>
                  <Input id="pass" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conf">Confirm Password</Label>
                  <Input id="conf" type="password" value={newUser.password_confirmation} onChange={e => setNewUser({...newUser, password_confirmation: e.target.value})} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-brand-green">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-brand-green/10 p-3 rounded-2xl">
              <Users className="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Users</p>
              <h3 className="text-2xl font-bold text-brand-dark">{users.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Admins</p>
              <h3 className="text-2xl font-bold text-brand-dark">{users.filter(u => u.role === 'admin').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-2xl">
              <UserCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Field Agents</p>
              <h3 className="text-2xl font-bold text-brand-dark">{users.filter(u => u.role === 'agent').length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table Card */}
      <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">User Directory</CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-10 h-9 bg-white/50 border-none shadow-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold">User</TableHead>
                <TableHead className="font-bold">Role</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-brand-dark">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      user.role === 'admin' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold' 
                        : 'bg-orange-50 text-orange-700 border-orange-200 font-bold'
                    }>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-green" />
                      <span className="text-xs font-medium">Active</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
