import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/lib/services/user.service";
import type { User } from "@/types/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Plus, 
  Users, 
  ShieldCheck, 
  UserCircle, 
  Mail, 
  Calendar,
  Search,
  MoreHorizontal,
  Trash2,
  Loader2
} from "lucide-react";
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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
      toast.error("Failed to sync user directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
    else setLoading(false);
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
      toast.success("User account created successfully.");
      fetchData();
    } catch (error: any) {
      console.error("Failed to create user", error);
      toast.error(error.response?.data?.message || "Failed to create user account.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await userService.deleteUser(id);
      toast.success("User deleted successfully.");
      fetchData();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete user.";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-20">
         <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading User Directory...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ShieldCheck className="w-16 h-16 text-destructive/20" />
        <h2 className="text-2xl font-bold text-brand-dark dark:text-white">Access Restricted</h2>
        <p className="text-muted-foreground font-medium">Only system administrators can manage users.</p>
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
          <h1 className="text-3xl font-bold tracking-tight text-brand-dark dark:text-white">User Management</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Manage system access for administrators and field agents.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-green hover:bg-brand-green/90 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Add New User
            </Button>
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
                  <Select value={newUser.role || ""} onValueChange={(val) => setNewUser(prev => ({ ...prev, role: val }))}>
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
                <Button type="submit" className="bg-brand-green text-white">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-brand-green/10 p-3 rounded-2xl">
              <Users className="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Users</p>
              <h3 className="text-2xl font-bold text-brand-dark dark:text-white">{users.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Admins</p>
              <h3 className="text-2xl font-bold text-brand-dark dark:text-white">{users.filter(u => u.role === 'admin').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-2xl">
              <UserCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Field Agents</p>
              <h3 className="text-2xl font-bold text-brand-dark dark:text-white">{users.filter(u => u.role === 'agent').length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table Card */}
      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-sm overflow-hidden">
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
                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors border-border/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-brand-dark dark:text-white">{user.name}</p>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
