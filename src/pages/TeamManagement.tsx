import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserPlus,
  Shield,
  Crown,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Mail,
  Calendar,
  Activity,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Target,
  BarChart3,
  MessageSquare,
  Bell,
  History,
} from "lucide-react";
import {
  multiTenantManager,
  TenantUser,
  TenantInvitation,
  AuditLog,
} from "@/services/multiTenantManager";
import {
  collaborationService,
  CollaborationProject,
  Task,
  Notification,
} from "@/services/collaborationService";
import { useToast } from "@/hooks/use-toast";

interface TeamMemberExtended extends TenantUser {
  projectsCount: number;
  tasksCompleted: number;
  tasksActive: number;
  performance: number;
  collaborationScore: number;
}

const TeamManagement: React.FC = () => {
  const { toast } = useToast();
  const [team, setTeam] = useState<TeamMemberExtended[]>([]);
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "analyst" as TenantUser["role"],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    loadTeamData();
    loadInvitations();
    loadAuditLogs();
  }, []);

  const loadTeamData = async () => {
    const tenant = multiTenantManager.getCurrentTenant();
    if (!tenant) return;

    // Enhance team members with collaboration data
    const enhancedTeam: TeamMemberExtended[] = await Promise.all(
      tenant.users.map(async (user) => {
        const projects = await collaborationService.getProjectsByUser(user.id);
        const tasks = await collaborationService.getTasksByUser(user.id);

        return {
          ...user,
          projectsCount: projects.length,
          tasksCompleted: tasks.filter((t) => t.status === "completed").length,
          tasksActive: tasks.filter(
            (t) => t.status === "in_progress" || t.status === "todo",
          ).length,
          performance: Math.floor(Math.random() * 30) + 70, // Mock performance score
          collaborationScore: Math.floor(Math.random() * 40) + 60, // Mock collaboration score
        };
      }),
    );

    setTeam(enhancedTeam);
  };

  const loadInvitations = () => {
    // Mock invitations data
    const mockInvitations: TenantInvitation[] = [
      {
        id: "invite_1",
        tenantId: "tenant_demo",
        email: "new-member@demo-agency.com",
        role: "analyst",
        invitedBy: "user_1",
        invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        token: "invite_token_123",
      },
    ];
    setInvitations(mockInvitations);
  };

  const loadAuditLogs = () => {
    const logs = multiTenantManager.getAuditLogs("tenant_demo", {
      resource: "user",
    });
    setAuditLogs(logs.slice(0, 20)); // Latest 20 logs
  };

  const handleInviteUser = async () => {
    if (!inviteData.email || !inviteData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await multiTenantManager.inviteUser(
        "tenant_demo",
        inviteData.email,
        inviteData.role,
        "user_1",
      );

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${inviteData.email}`,
      });

      setInviteDialog(false);
      setInviteData({ email: "", role: "analyst" });
      loadInvitations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (
    userId: string,
    newRole: TenantUser["role"],
  ) => {
    try {
      await multiTenantManager.updateUserRole("tenant_demo", userId, newRole);

      toast({
        title: "Role Updated",
        description: "User role has been updated successfully",
      });

      loadTeamData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const result = await multiTenantManager.removeUser("tenant_demo", userId);

      if (result.success) {
        toast({
          title: "User Removed",
          description: "User has been removed from the team",
        });
        loadTeamData();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: TenantUser["role"]) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "manager":
        return <Star className="w-4 h-4 text-blue-500" />;
      case "analyst":
        return <BarChart3 className="w-4 h-4 text-green-500" />;
      case "viewer":
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: TenantUser["role"]) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "analyst":
        return "bg-green-100 text-green-800 border-green-200";
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: TenantUser["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "invited":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "suspended":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredTeam = team.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const selectedMemberData = team.find((m) => m.id === selectedMember);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              Team Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage team members, roles, and collaboration across your
              organization
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {team.length} Members
            </Badge>
            <Dialog open={inviteDialog} onOpenChange={setInviteDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="member@company.com"
                      value={inviteData.email}
                      onChange={(e) =>
                        setInviteData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={inviteData.role}
                      onValueChange={(value) =>
                        setInviteData((prev) => ({
                          ...prev,
                          role: value as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setInviteDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleInviteUser} disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Invitation"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="analytics">Team Analytics</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          {/* Team Members */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeam.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {member.name}
                            </CardTitle>
                            <CardDescription>{member.email}</CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => setSelectedMember(member.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            {member.role !== "owner" && (
                              <DropdownMenuItem
                                onClick={() => handleRemoveUser(member.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getRoleColor(member.role)}>
                          {getRoleIcon(member.role)}
                          <span className="ml-1">{member.role}</span>
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(member.status)}
                          <span className="text-sm text-gray-600">
                            {member.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-blue-600">
                            {member.projectsCount}
                          </p>
                          <p className="text-gray-600">Projects</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">
                            {member.tasksCompleted}
                          </p>
                          <p className="text-gray-600">Completed</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Performance</span>
                          <span>{member.performance}%</span>
                        </div>
                        <Progress value={member.performance} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Collaboration</span>
                          <span>{member.collaborationScore}%</span>
                        </div>
                        <Progress
                          value={member.collaborationScore}
                          className="h-2"
                        />
                      </div>

                      {member.lastLogin && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last active:{" "}
                          {new Date(member.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Member Details Modal */}
            <Dialog
              open={selectedMember !== null}
              onOpenChange={(open) => !open && setSelectedMember(null)}
            >
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Team Member Details</DialogTitle>
                </DialogHeader>
                {selectedMemberData && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-lg">
                          {selectedMemberData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {selectedMemberData.name}
                        </h3>
                        <p className="text-gray-600">
                          {selectedMemberData.email}
                        </p>
                        <Badge
                          className={getRoleColor(selectedMemberData.role)}
                        >
                          {selectedMemberData.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                          <p className="text-2xl font-bold">
                            {selectedMemberData.projectsCount}
                          </p>
                          <p className="text-sm text-gray-600">
                            Active Projects
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                          <p className="text-2xl font-bold">
                            {selectedMemberData.tasksCompleted}
                          </p>
                          <p className="text-sm text-gray-600">
                            Tasks Completed
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Activity className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                          <p className="text-2xl font-bold">
                            {selectedMemberData.tasksActive}
                          </p>
                          <p className="text-sm text-gray-600">Active Tasks</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                          <p className="text-2xl font-bold">
                            {selectedMemberData.performance}%
                          </p>
                          <p className="text-sm text-gray-600">Performance</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Permissions</h4>
                        <div className="space-y-2">
                          {selectedMemberData.permissions.map(
                            (permission, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <span className="text-sm">
                                  {permission.resource}
                                </span>
                                <div className="flex gap-1">
                                  {permission.actions.map((action) => (
                                    <Badge
                                      key={action}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Preferences</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Email Notifications</span>
                            <Switch
                              checked={
                                selectedMemberData.preferences.notifications
                                  .email
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Push Notifications</span>
                            <Switch
                              checked={
                                selectedMemberData.preferences.notifications
                                  .push
                              }
                            />
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">
                              Notification Frequency:
                            </span>
                            <p className="text-sm font-medium">
                              {
                                selectedMemberData.preferences.notifications
                                  .frequency
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Invitations */}
          <TabsContent value="invitations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  Manage sent invitations and track their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invitations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No pending invitations</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Invited By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invitations.map((invitation) => (
                        <TableRow key={invitation.id}>
                          <TableCell>{invitation.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(invitation.role)}>
                              {invitation.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{invitation.invitedBy}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{invitation.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              invitation.expiresAt,
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Resend
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <p className="text-3xl font-bold">{team.length}</p>
                  <p className="text-gray-600">Total Members</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p className="text-3xl font-bold">
                    {team.filter((m) => m.status === "active").length}
                  </p>
                  <p className="text-gray-600">Active Members</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <p className="text-3xl font-bold">
                    {Math.round(
                      team.reduce((sum, m) => sum + m.performance, 0) /
                        team.length,
                    )}
                    %
                  </p>
                  <p className="text-gray-600">Avg Performance</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                  <p className="text-3xl font-bold">
                    {Math.round(
                      team.reduce((sum, m) => sum + m.collaborationScore, 0) /
                        team.length,
                    )}
                    %
                  </p>
                  <p className="text-gray-600">Collaboration</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Role Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["owner", "admin", "manager", "analyst", "viewer"].map(
                      (role) => {
                        const count = team.filter(
                          (m) => m.role === role,
                        ).length;
                        const percentage = (count / team.length) * 100;

                        return (
                          <div key={role} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                {getRoleIcon(role as TenantUser["role"])}
                                <span className="capitalize">{role}</span>
                              </div>
                              <span>
                                {count} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      },
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.slice(0, 5).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {member.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {member.tasksCompleted} tasks
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.performance}% performance
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audit Log */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Team Activity Log
                </CardTitle>
                <CardDescription>
                  Track all team-related activities and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {log.action.replace(/_/g, " ").toLowerCase()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {log.resource} •{" "}
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                        {Object.keys(log.details).length > 0 && (
                          <div className="mt-1 text-xs text-gray-500">
                            {JSON.stringify(log.details, null, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamManagement;
