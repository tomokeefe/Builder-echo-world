// Collaboration service for team communication and workflow management

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "manager" | "analyst" | "viewer";
  department: string;
  status: "online" | "away" | "busy" | "offline";
  lastSeen: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: ("read" | "write" | "delete" | "manage")[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  resourceType: "campaign" | "audience" | "client" | "dashboard";
  resourceId: string;
  parentId?: string; // for threaded comments
  created: string;
  updated?: string;
  mentions: string[]; // user IDs mentioned in comment
  attachments: Attachment[];
  reactions: Reaction[];
  resolved: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: "image" | "document" | "link" | "file";
  url: string;
  size?: number;
  mimeType?: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: "mention" | "comment" | "assignment" | "approval" | "system";
  title: string;
  message: string;
  resourceType?: string;
  resourceId?: string;
  fromUserId?: string;
  fromUserName?: string;
  toUserId: string;
  read: boolean;
  created: string;
  actionUrl?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ApprovalRequest {
  id: string;
  type:
    | "campaign_launch"
    | "budget_increase"
    | "audience_targeting"
    | "content_review";
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  approverId: string;
  approverName: string;
  resourceType: string;
  resourceId: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  created: string;
  resolved?: string;
  comments: Comment[];
  attachments: Attachment[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assignerId: string;
  assignerName: string;
  status: "todo" | "in_progress" | "review" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  created: string;
  updated: string;
  completed?: string;
  tags: string[];
  resourceType?: string;
  resourceId?: string;
  checklist: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  timeTracking: {
    estimated?: number; // hours
    actual?: number; // hours
    started?: string;
  };
}

// Mock data for demonstration
export const mockTeamMembers: TeamMember[] = [
  {
    id: "user-1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "admin",
    department: "Marketing",
    status: "online",
    lastSeen: new Date().toISOString(),
    permissions: [
      { resource: "campaigns", actions: ["read", "write", "delete", "manage"] },
      { resource: "audiences", actions: ["read", "write", "delete"] },
      { resource: "clients", actions: ["read", "write"] },
    ],
  },
  {
    id: "user-2",
    name: "Mike Chen",
    email: "mike@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    role: "manager",
    department: "Analytics",
    status: "busy",
    lastSeen: "2024-01-20T14:30:00Z",
    permissions: [
      { resource: "campaigns", actions: ["read", "write"] },
      { resource: "audiences", actions: ["read", "write"] },
      { resource: "analytics", actions: ["read", "write", "manage"] },
    ],
  },
  {
    id: "user-3",
    name: "Emma Davis",
    email: "emma@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    role: "analyst",
    department: "Performance",
    status: "away",
    lastSeen: "2024-01-20T13:15:00Z",
    permissions: [
      { resource: "campaigns", actions: ["read"] },
      { resource: "audiences", actions: ["read"] },
      { resource: "analytics", actions: ["read", "write"] },
    ],
  },
];

export const mockComments: Comment[] = [
  {
    id: "comment-1",
    content:
      "Great performance on this campaign! The CTR is 15% higher than expected. @mike should we increase the budget?",
    authorId: "user-1",
    authorName: "Sarah Johnson",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    resourceType: "campaign",
    resourceId: "campaign-1",
    created: "2024-01-20T10:30:00Z",
    mentions: ["user-2"],
    attachments: [],
    reactions: [
      {
        emoji: "👍",
        userId: "user-2",
        userName: "Mike Chen",
        timestamp: "2024-01-20T10:35:00Z",
      },
      {
        emoji: "🎉",
        userId: "user-3",
        userName: "Emma Davis",
        timestamp: "2024-01-20T11:00:00Z",
      },
    ],
    resolved: false,
  },
  {
    id: "comment-2",
    content:
      "Absolutely! Let's increase by 20%. The ROAS is looking solid at 4.2x.",
    authorId: "user-2",
    authorName: "Mike Chen",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    resourceType: "campaign",
    resourceId: "campaign-1",
    parentId: "comment-1",
    created: "2024-01-20T10:45:00Z",
    mentions: [],
    attachments: [],
    reactions: [],
    resolved: false,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "mention",
    title: "You were mentioned in a comment",
    message: "Sarah Johnson mentioned you in campaign 'Summer Sale'",
    resourceType: "campaign",
    resourceId: "campaign-1",
    fromUserId: "user-1",
    fromUserName: "Sarah Johnson",
    toUserId: "user-2",
    read: false,
    created: "2024-01-20T10:30:00Z",
    actionUrl: "/campaigns/campaign-1#comment-1",
    priority: "medium",
  },
  {
    id: "notif-2",
    type: "approval",
    title: "Approval Request",
    message: "Budget increase request for 'Brand Awareness' campaign",
    resourceType: "campaign",
    resourceId: "campaign-2",
    fromUserId: "user-3",
    fromUserName: "Emma Davis",
    toUserId: "user-1",
    read: false,
    created: "2024-01-20T09:15:00Z",
    actionUrl: "/approvals/approval-1",
    priority: "high",
  },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Review Q1 Campaign Performance",
    description:
      "Analyze performance metrics for all Q1 campaigns and prepare summary report",
    assigneeId: "user-3",
    assigneeName: "Emma Davis",
    assignerId: "user-2",
    assignerName: "Mike Chen",
    status: "in_progress",
    priority: "high",
    dueDate: "2024-01-25T17:00:00Z",
    created: "2024-01-18T09:00:00Z",
    updated: "2024-01-20T14:30:00Z",
    tags: ["analytics", "reporting", "Q1"],
    resourceType: "campaign",
    resourceId: "campaign-1",
    checklist: [
      { id: "check-1", text: "Gather campaign data", completed: true },
      { id: "check-2", text: "Analyze performance metrics", completed: true },
      { id: "check-3", text: "Create visualizations", completed: false },
      { id: "check-4", text: "Write summary report", completed: false },
    ],
    timeTracking: {
      estimated: 8,
      actual: 6.5,
      started: "2024-01-19T09:00:00Z",
    },
  },
  {
    id: "task-2",
    title: "Set up new audience targeting",
    description:
      "Create lookalike audiences based on high-value customer segments",
    assigneeId: "user-1",
    assigneeName: "Sarah Johnson",
    assignerId: "user-2",
    assignerName: "Mike Chen",
    status: "todo",
    priority: "medium",
    dueDate: "2024-01-22T12:00:00Z",
    created: "2024-01-20T10:00:00Z",
    updated: "2024-01-20T10:00:00Z",
    tags: ["audiences", "targeting", "setup"],
    checklist: [
      { id: "check-5", text: "Identify source audiences", completed: false },
      { id: "check-6", text: "Create lookalike segments", completed: false },
      { id: "check-7", text: "Test audience performance", completed: false },
    ],
    timeTracking: {
      estimated: 4,
    },
  },
];

// Collaboration service class
class CollaborationService {
  private teamMembers: Map<string, TeamMember> = new Map();
  private comments: Map<string, Comment[]> = new Map();
  private notifications: Map<string, Notification[]> = new Map();
  private tasks: Map<string, Task> = new Map();
  private activityLogs: ActivityLog[] = [];
  private currentUserId = "user-1"; // Mock current user

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    // Load team members
    mockTeamMembers.forEach((member) =>
      this.teamMembers.set(member.id, member),
    );

    // Load comments grouped by resource
    const commentsByResource = new Map<string, Comment[]>();
    mockComments.forEach((comment) => {
      const key = `${comment.resourceType}-${comment.resourceId}`;
      if (!commentsByResource.has(key)) {
        commentsByResource.set(key, []);
      }
      commentsByResource.get(key)!.push(comment);
    });
    this.comments = commentsByResource;

    // Load notifications grouped by user
    const notificationsByUser = new Map<string, Notification[]>();
    mockNotifications.forEach((notification) => {
      if (!notificationsByUser.has(notification.toUserId)) {
        notificationsByUser.set(notification.toUserId, []);
      }
      notificationsByUser.get(notification.toUserId)!.push(notification);
    });
    this.notifications = notificationsByUser;

    // Load tasks
    mockTasks.forEach((task) => this.tasks.set(task.id, task));
  }

  // Team management methods
  getTeamMembers(): TeamMember[] {
    return Array.from(this.teamMembers.values());
  }

  getTeamMember(id: string): TeamMember | undefined {
    return this.teamMembers.get(id);
  }

  updateMemberStatus(userId: string, status: TeamMember["status"]): void {
    const member = this.teamMembers.get(userId);
    if (member) {
      member.status = status;
      member.lastSeen = new Date().toISOString();
    }
  }

  // Comment methods
  getComments(resourceType: string, resourceId: string): Comment[] {
    const key = `${resourceType}-${resourceId}`;
    return this.comments.get(key) || [];
  }

  addComment(comment: Omit<Comment, "id" | "created">): Comment {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      created: new Date().toISOString(),
    };

    const key = `${comment.resourceType}-${comment.resourceId}`;
    if (!this.comments.has(key)) {
      this.comments.set(key, []);
    }
    this.comments.get(key)!.push(newComment);

    // Send notifications for mentions
    comment.mentions.forEach((userId) => {
      this.addNotification({
        type: "mention",
        title: "You were mentioned in a comment",
        message: `${comment.authorName} mentioned you`,
        resourceType: comment.resourceType,
        resourceId: comment.resourceId,
        fromUserId: comment.authorId,
        fromUserName: comment.authorName,
        toUserId: userId,
        priority: "medium",
        actionUrl: `/${comment.resourceType}s/${comment.resourceId}#comment-${newComment.id}`,
      });
    });

    this.logActivity({
      action: "comment_added",
      description: `Added comment on ${comment.resourceType}`,
      userId: comment.authorId,
      userName: comment.authorName,
      resourceType: comment.resourceType,
      resourceId: comment.resourceId,
    });

    return newComment;
  }

  addReaction(
    commentId: string,
    emoji: string,
    userId: string,
    userName: string,
  ): void {
    // Find comment across all resources
    for (const [key, commentList] of this.comments) {
      const comment = commentList.find((c) => c.id === commentId);
      if (comment) {
        // Remove existing reaction from this user
        comment.reactions = comment.reactions.filter(
          (r) => r.userId !== userId,
        );
        // Add new reaction
        comment.reactions.push({
          emoji,
          userId,
          userName,
          timestamp: new Date().toISOString(),
        });
        break;
      }
    }
  }

  resolveComment(commentId: string): void {
    for (const [key, commentList] of this.comments) {
      const comment = commentList.find((c) => c.id === commentId);
      if (comment) {
        comment.resolved = true;
        break;
      }
    }
  }

  // Notification methods
  getNotifications(userId: string): Notification[] {
    return this.notifications.get(userId) || [];
  }

  addNotification(
    notification: Omit<Notification, "id" | "created" | "read">,
  ): void {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      created: new Date().toISOString(),
      read: false,
    };

    if (!this.notifications.has(notification.toUserId)) {
      this.notifications.set(notification.toUserId, []);
    }
    this.notifications.get(notification.toUserId)!.unshift(newNotification);
  }

  markNotificationRead(notificationId: string, userId: string): void {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      const notification = userNotifications.find(
        (n) => n.id === notificationId,
      );
      if (notification) {
        notification.read = true;
      }
    }
  }

  markAllNotificationsRead(userId: string): void {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      userNotifications.forEach((notification) => {
        notification.read = true;
      });
    }
  }

  getUnreadNotificationCount(userId: string): number {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter((n) => !n.read).length;
  }

  // Task management methods
  getTasks(assigneeId?: string): Task[] {
    const allTasks = Array.from(this.tasks.values());
    if (assigneeId) {
      return allTasks.filter((task) => task.assigneeId === assigneeId);
    }
    return allTasks;
  }

  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  createTask(task: Omit<Task, "id" | "created" | "updated">): Task {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    this.tasks.set(newTask.id, newTask);

    // Notify assignee
    this.addNotification({
      type: "assignment",
      title: "New task assigned",
      message: `${task.assignerName} assigned you: ${task.title}`,
      fromUserId: task.assignerId,
      fromUserName: task.assignerName,
      toUserId: task.assigneeId,
      priority: task.priority === "urgent" ? "urgent" : "medium",
      actionUrl: `/tasks/${newTask.id}`,
    });

    this.logActivity({
      action: "task_created",
      description: `Created task: ${task.title}`,
      userId: task.assignerId,
      userName: task.assignerName,
      resourceType: "task",
      resourceId: newTask.id,
    });

    return newTask;
  }

  updateTask(taskId: string, updates: Partial<Task>): Task | undefined {
    const task = this.tasks.get(taskId);
    if (!task) return undefined;

    Object.assign(task, {
      ...updates,
      updated: new Date().toISOString(),
    });

    // Log status changes
    if (updates.status) {
      this.logActivity({
        action: "task_status_changed",
        description: `Changed task status to ${updates.status}`,
        userId: this.currentUserId,
        userName: this.teamMembers.get(this.currentUserId)?.name || "Unknown",
        resourceType: "task",
        resourceId: taskId,
        metadata: { from: task.status, to: updates.status },
      });

      // Notify if completed
      if (updates.status === "completed") {
        this.addNotification({
          type: "system",
          title: "Task completed",
          message: `${task.title} has been completed`,
          toUserId: task.assignerId,
          priority: "low",
          actionUrl: `/tasks/${taskId}`,
        });
      }
    }

    return task;
  }

  updateTaskProgress(
    taskId: string,
    checklistItemId: string,
    completed: boolean,
  ): void {
    const task = this.tasks.get(taskId);
    if (task) {
      const item = task.checklist.find((item) => item.id === checklistItemId);
      if (item) {
        item.completed = completed;
        task.updated = new Date().toISOString();
      }
    }
  }

  // Activity logging
  logActivity(activity: Omit<ActivityLog, "id" | "timestamp">): void {
    const newActivity: ActivityLog = {
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    this.activityLogs.unshift(newActivity);

    // Keep only last 1000 activities
    if (this.activityLogs.length > 1000) {
      this.activityLogs = this.activityLogs.slice(0, 1000);
    }
  }

  getActivityLogs(resourceType?: string, resourceId?: string): ActivityLog[] {
    if (resourceType && resourceId) {
      return this.activityLogs.filter(
        (log) =>
          log.resourceType === resourceType && log.resourceId === resourceId,
      );
    }
    return this.activityLogs;
  }

  // Statistics and insights
  getCollaborationStats(): {
    totalTeamMembers: number;
    onlineMembers: number;
    totalComments: number;
    unreadNotifications: number;
    activeTasks: number;
    completedTasks: number;
    averageTaskCompletionTime: number;
  } {
    const totalComments = Array.from(this.comments.values()).reduce(
      (sum, comments) => sum + comments.length,
      0,
    );

    const unreadNotifications = Array.from(this.notifications.values()).reduce(
      (sum, notifications) => sum + notifications.filter((n) => !n.read).length,
      0,
    );

    const tasks = Array.from(this.tasks.values());
    const activeTasks = tasks.filter(
      (t) => t.status !== "completed" && t.status !== "cancelled",
    ).length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;

    const completedTasksWithTime = tasks.filter(
      (t) => t.status === "completed" && t.timeTracking.actual,
    );
    const averageTaskCompletionTime =
      completedTasksWithTime.length > 0
        ? completedTasksWithTime.reduce(
            (sum, t) => sum + (t.timeTracking.actual || 0),
            0,
          ) / completedTasksWithTime.length
        : 0;

    return {
      totalTeamMembers: this.teamMembers.size,
      onlineMembers: Array.from(this.teamMembers.values()).filter(
        (m) => m.status === "online",
      ).length,
      totalComments,
      unreadNotifications,
      activeTasks,
      completedTasks,
      averageTaskCompletionTime,
    };
  }
}

// Export singleton instance
export const collaborationService = new CollaborationService();

export default collaborationService;
