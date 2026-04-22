"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fieldService, Field } from "@/lib/services/field.service";
import { userService } from "@/lib/services/user.service";
import { User } from "@/types/auth";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  MapPin, 
  Calendar, 
  User as UserIcon,
  Sprout,
  Activity,
  History,
  MoreHorizontal
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function FieldsPage() {
  const { isAdmin, user: currentUser } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Create Field State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  interface NewField {
    name: string;
    crop_type: string;
    planting_date: string;
    assigned_agent_id: string | null;
  }

  const [newField, setNewField] = useState<NewField>({
    name: "",
    crop_type: "",
    planting_date: "",
    assigned_agent_id: "",
  });

  // Update Field State
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  interface UpdateData {
    stage: string | null;
    notes: string;
  }

  const [updateData, setUpdateData] = useState<UpdateData>({ stage: "", notes: "" });

  const fetchData = async () => {
    try {
      const [fieldsData, agentsData] = await Promise.all([
        fieldService.getAllFields(),
        isAdmin ? userService.getAgents() : Promise.resolve([])
      ]);
      setFields(fieldsData);
      setAgents(agentsData);
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newField.assigned_agent_id) return;
    try {
      await fieldService.createField({
        ...newField,
        assigned_agent_id: parseInt(newField.assigned_agent_id as string)
      });
      setIsCreateOpen(false);
      setNewField({ name: "", crop_type: "", planting_date: "", assigned_agent_id: "" });
      fetchData();
    } catch (error) {
      console.error("Failed to create field", error);
    }
  };

  const handleLogUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField || !updateData.stage) return;
    try {
      await fieldService.logFieldUpdate(selectedField.id, {
        ...updateData,
        stage: updateData.stage as string
      });
      setIsUpdateOpen(false);
      setUpdateData({ stage: "", notes: "" });
      fetchData();
    } catch (error) {
      console.error("Failed to log update", error);
    }
  };

  const filteredFields = fields.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.crop_type.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "At Risk": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Completed": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-brand-green/10 text-brand-green border-brand-green/20";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-dark">Field Management</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Monitor, assign, and update agricultural production units.
          </p>
        </div>
        
        {isAdmin && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger 
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-brand-green hover:bg-brand-green/90 shadow-md"
              )}
            >
              <Plus className="w-4 h-4 mr-2" /> New Field
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreateField}>
                <DialogHeader>
                  <DialogTitle>Add New Field</DialogTitle>
                  <DialogDescription>
                    Create a new field unit and assign an agent to monitor its progress.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Field Name</Label>
                    <Input id="name" placeholder="e.g. North Section A" value={newField.name} onChange={e => setNewField({...newField, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop">Crop Type</Label>
                    <Input id="crop" placeholder="e.g. Wheat, Corn" value={newField.crop_type} onChange={e => setNewField({...newField, crop_type: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Planting Date</Label>
                    <Input id="date" type="date" value={newField.planting_date} onChange={e => setNewField({...newField, planting_date: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent">Assign Agent</Label>
                    <Select 
                      value={newField.assigned_agent_id} 
                      onValueChange={(val) => setNewField(prev => ({ ...prev, assigned_agent_id: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id.toString()}>{agent.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-brand-green">Create Field</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search fields or crop types..." 
            className="pl-10 bg-white border-none shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-white border-none shadow-sm">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      {/* Fields List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFields.map(field => (
          <Card key={field.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-brand-green" />
                      <h3 className="font-bold text-lg text-brand-dark">{field.name}</h3>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{field.crop_type}</p>
                  </div>
                  <Badge variant="outline" className={`font-bold ${getStatusColor(field.status)}`}>
                    {field.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(field.planting_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    {field.stage}
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Assigned to: <span className="text-brand-dark font-bold">{agents.find(a => a.id === field.assigned_agent_id)?.name || "Agent"}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-muted/30 p-4 flex justify-between items-center border-t border-border/50">
                <Button variant="ghost" size="sm" className="text-xs font-bold hover:text-brand-green">
                  <History className="w-4 h-4 mr-2" /> History
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger 
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "h-8 w-8"
                    )}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedField(field);
                      setUpdateData({ stage: field.stage, notes: "" });
                      setIsUpdateOpen(true);
                    }}>
                      Log Progress
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem className="text-destructive">Delete Field</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Log Update Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleLogUpdate}>
            <DialogHeader>
              <DialogTitle>Log Progress Update</DialogTitle>
              <DialogDescription>
                Record the current growth stage and observations for <strong>{selectedField?.name}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Current Stage</Label>
                <Select value={updateData.stage} onValueChange={(val) => setUpdateData(prev => ({ ...prev, stage: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planted">Planted</SelectItem>
                    <SelectItem value="Growing">Growing</SelectItem>
                    <SelectItem value="Ready">Ready for Harvest</SelectItem>
                    <SelectItem value="Harvested">Harvested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observations / Notes</Label>
                <Input 
                  id="notes" 
                  placeholder="e.g. Healthy growth, pests noticed..." 
                  value={updateData.notes} 
                  onChange={e => setUpdateData({...updateData, notes: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-brand-green">Save Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
