import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Users,
  CheckSquare,
  Bell,
  Send,
  MoreVertical,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Star,
  Filter,
  Search,
  Plus,
  UserPlus,
  Settings,
} from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import MobileNavigation from "@/components/ui/mobile-navigation";
import { useOnboarding } from "@/hooks/useOnboarding";

// Mock collaboration service
const collaborationService = {
  getComments: () => [
    {
      id: "1",
      authorName: "Sarah Chen",
      authorAvatar: "/api/placeholder/32/32",
      content:
        "Great progress on the Q4 campaign! The CTR has improved by 23% since we implemented the new targeting strategy.",
      created: "2024-01-15T10:30:00Z",
      mentions: [],
      reactions: { likes: 5, hearts: 2 },
    },
    {
      id: "2",
      authorName: "Mike Johnson",
      authorAvatar: "/api/placeholder/32/32",
      content:
        "Hey @sarah, can you review the budget allocation for the Facebook ads? I think we should increase it by 15%.",
      created: "2024-01-15T11:45:00Z",
      mentions: ["sarah"],
      reactions: { likes: 3 },
    },
    {
      id: "3",
      authorName: "Alex Rivera",
      authorAvatar: "/api/placeholder/32/32",
      content:
        "The A/B test results are in! Version B is performing 31% better. Should we roll it out to all campaigns?",
      created: "2024-01-15T14:20:00Z",
      mentions: [],
      reactions: { likes: 8, hearts: 3 },
    },
  ],

  getTasks: () => [
    {
      id: "1",
      title: "Review Q4 Campaign Performance",
      description: "Analyze all campaign metrics and prepare summary report",
      assignee: "Sarah Chen",
      assigneeAvatar: "/api/placeholder/32/32",
      status: "completed",
      priority: "high",
      dueDate: "2024-01-14",
      progress: 100,
    },
    {
      id: "2",
      title: "Update Facebook Ad Creative",
      description: "Design new creative assets for the winter campaign",
      assignee: "Mike Johnson",
      assigneeAvatar: "/api/placeholder/32/32",
      status: "in-progress",
      priority: "medium",
      dueDate: "2024-01-18",
      progress: 65,
    },
    {
      id: "3",
      title: "A/B Test Analysis",
      description: "Compare performance of landing page variants",
      assignee: "Alex Rivera",
      assigneeAvatar: "/api/placeholder/32/32",
      status: "pending",
      priority: "high",
      dueDate: "2024-01-20",
      progress: 0,
    },
    {
      id: "4",
      title: "Budget Reallocation",
      description: "Redistribute budget based on performance data",
      assignee: "Sarah Chen",
      assigneeAvatar: "/api/placeholder/32/32",
      status: "in-progress",
      priority: "urgent",
      dueDate: "2024-01-16",
      progress: 80,
    },
  ],

  getTeamMembers: () => [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Marketing Manager",
      avatar: "/api/placeholder/48/48",
      status: "online",
      lastActive: "now",
    },
    {
      id: "2",
      name: "Mike Johnson",
      role: "Campaign Specialist",
      avatar: "/api/placeholder/48/48",
      status: "away",
      lastActive: "5 minutes ago",
    },
    {
      id: "3",
      name: "Alex Rivera",
      role: "Data Analyst",
      avatar: "/api/placeholder/48/48",
      status: "busy",
      lastActive: "1 hour ago",
    },
    {
      id: "4",
      name: "Emma Davis",
      role: "Creative Director",
      avatar: "/api/placeholder/48/48",
      status: "offline",
      lastActive: "2 hours ago",
    },
  ],

  getNotifications: () => [
    {
      id: "1",
      type: "mention",
      title: "You were mentioned",
      message: "Mike mentioned you in a comment",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "task",
      title: "Task due soon",
      message: "Budget Reallocation task is due tomorrow",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "comment",
      title: "New comment",
      message: "Alex commented on Q4 Campaign",
      time: "2 hours ago",
      read: true,
    },
  ],
};

const Collaboration: React.FC = () => {
  const mobile = useMobile();
  const {
    isActive: tourActive,
    startTour,
    completeTour,
    skipTour,
  } = useOnboarding();
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.1,
  });

  const [activeTab, setActiveTab] = useState("comments");
  const [newComment, setNewComment] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [comments, setComments] = useState(collaborationService.getComments());
  const [tasks, setTasks] = useState(collaborationService.getTasks());
  const [teamMembers] = useState(collaborationService.getTeamMembers());
  const [notifications, setNotifications] = useState(
    collaborationService.getNotifications(),
  );

  useEffect(() => {
    if (!tourActive) {
      const timer = setTimeout(() => {
        startTour("collaboration-tour");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tourActive, startTour]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || task.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchTerm, filterStatus]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        authorName: "You",
        authorAvatar: "/api/placeholder/32/32",
        content: newComment,
        created: new Date().toISOString(),
        mentions: [],
        reactions: { likes: 0 },
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now().toString(),
        ...newTask,
        assigneeAvatar: "/api/placeholder/32/32",
        status: "pending" as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        progress: 0,
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        description: "",
        assignee: "",
        priority: "medium",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <div className="w-3 h-3 bg-green-500 rounded-full" />;
      case "away":
        return <div className="w-3 h-3 bg-yellow-500 rounded-full" />;
      case "busy":
        return <div className="w-3 h-3 bg-red-500 rounded-full" />;
      case "offline":
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <>
      {mobile.isMobile && <MobileNavigation />}
      <motion.div
        className={`min-h-screen p-4 md:p-6 ${mobile.isMobile ? "pt-20 pb-20" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          data-tour="collaboration-header"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Team Collaboration
              </h1>
              <p className="text-gray-600 mt-1">
                Communicate, collaborate, and manage tasks with your team
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.filter((m) => m.status === "online").length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter((t) => t.status !== "completed").length}
                  </p>
                </div>
                <CheckSquare className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Comments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {comments.length}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter((n) => !n.read).length}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card data-tour="collaboration-tabs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Team Workspace
                </CardTitle>
                <CardDescription>
                  Collaborate with your team through comments and tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comments">
                      Comments & Discussion
                    </TabsTrigger>
                    <TabsTrigger value="tasks">Tasks & Projects</TabsTrigger>
                  </TabsList>

                  <TabsContent value="comments" className="mt-6">
                    {/* Add Comment */}
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts, ask questions, or provide updates..."
                        className="mb-3"
                        rows={3}
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          Use @username to mention team members
                        </p>
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={comment.authorAvatar} />
                              <AvatarFallback>
                                {comment.authorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">
                                  {comment.authorName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(comment.created).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-2">
                                {comment.content}
                              </p>
                              <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500">
                                  <Star className="w-4 h-4" />
                                  {comment.reactions.likes || 0}
                                </button>
                                <button className="text-sm text-gray-500 hover:text-blue-500">
                                  Reply
                                </button>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                <DropdownMenuItem>Report</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-6">
                    {/* Task Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search tasks..."
                          className="w-full"
                        />
                      </div>
                      <div className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                              <Filter className="w-4 h-4 mr-2" />
                              Status: {filterStatus}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => setFilterStatus("all")}
                            >
                              All
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setFilterStatus("pending")}
                            >
                              Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setFilterStatus("in-progress")}
                            >
                              In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setFilterStatus("completed")}
                            >
                              Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          New Task
                        </Button>
                      </div>
                    </div>

                    {/* Add Task Form */}
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                          placeholder="Task title..."
                        />
                        <select
                          value={newTask.priority}
                          onChange={(e) =>
                            setNewTask({ ...newTask, priority: e.target.value })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            description: e.target.value,
                          })
                        }
                        placeholder="Task description..."
                        className="mb-3"
                        rows={2}
                      />
                      <div className="flex justify-between items-center">
                        <Input
                          value={newTask.assignee}
                          onChange={(e) =>
                            setNewTask({ ...newTask, assignee: e.target.value })
                          }
                          placeholder="Assign to team member..."
                          className="max-w-xs"
                        />
                        <Button
                          onClick={handleAddTask}
                          disabled={!newTask.title.trim()}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Task
                        </Button>
                      </div>
                    </div>

                    {/* Tasks List */}
                    <div className="space-y-4">
                      {filteredTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{task.title}</h3>
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status}
                                </Badge>
                                <Badge
                                  className={getPriorityColor(task.priority)}
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {task.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {task.assignee}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Due{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Avatar className="ml-4">
                              <AvatarImage src={task.assigneeAvatar} />
                              <AvatarFallback>
                                {task.assignee.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {task.status === "in-progress" && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{task.progress}%</span>
                              </div>
                              <Progress value={task.progress} className="h-2" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card data-tour="collaboration-team">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          {getStatusIcon(member.status)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">
                          {member.role}
                        </div>
                        <div className="text-xs text-gray-400">
                          {member.lastActive}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card data-tour="collaboration-notifications">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read
                          ? "bg-gray-50"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {notification.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {notification.message}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Collaboration;
