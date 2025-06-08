export interface CollaborationProject {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  ownerId: string;
  status: "active" | "archived" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  startDate: string;
  dueDate?: string;
  completedDate?: string;
  progress: number; // 0-100
  members: ProjectMember[];
  tasks: Task[];
  assets: ProjectAsset[];
  comments: Comment[];
  templates: WorkflowTemplate[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  userId: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  permissions: string[];
  joinedAt: string;
  lastActive?: string;
  avatar?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assigneeName?: string;
  status: "todo" | "in_progress" | "review" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: string[]; // task IDs
  attachments: TaskAttachment[];
  comments: Comment[];
  checklist: ChecklistItem[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  parentId?: string; // For threaded comments
  mentions: string[]; // user IDs
  reactions: Reaction[];
  attachments: CommentAttachment[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface CommentAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  thumbnail?: string;
}

export interface ProjectAsset {
  id: string;
  projectId: string;
  name: string;
  type: "image" | "video" | "document" | "design" | "other";
  url: string;
  thumbnail?: string;
  size: number;
  version: number;
  versions: AssetVersion[];
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  approvalStatus: "pending" | "approved" | "rejected" | "needs_changes";
  approvals: AssetApproval[];
}

export interface AssetVersion {
  id: string;
  version: number;
  url: string;
  changelog: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AssetApproval {
  id: string;
  userId: string;
  userName: string;
  status: "approved" | "rejected" | "needs_changes";
  feedback?: string;
  timestamp: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category:
    | "campaign_launch"
    | "content_creation"
    | "audience_research"
    | "reporting"
    | "custom";
  steps: WorkflowStep[];
  estimatedDuration: number; // days
  requiredRoles: string[];
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  assignedRole?: string;
  estimatedHours: number;
  dependencies: string[]; // step IDs
  checklist: string[];
  resources: string[];
  order: number;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  resourceType: "campaign" | "audience" | "creative" | "report";
  steps: ApprovalStep[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface ApprovalStep {
  id: string;
  name: string;
  approvers: string[]; // user IDs
  requiresAll: boolean; // all approvers or just one
  order: number;
  conditions?: ApprovalCondition[];
}

export interface ApprovalCondition {
  field: string;
  operator: "equals" | "greater_than" | "less_than" | "contains";
  value: any;
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  requestedBy: string;
  requestedAt: string;
  currentStep: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  approvals: StepApproval[];
  comments: Comment[];
}

export interface StepApproval {
  stepId: string;
  approverId: string;
  approverName: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  timestamp?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type:
    | "mention"
    | "assignment"
    | "approval"
    | "comment"
    | "deadline"
    | "project_update";
  title: string;
  message: string;
  resourceType?: string;
  resourceId?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

class CollaborationService {
  private projects: Map<string, CollaborationProject> = new Map();
  private workflows: Map<string, ApprovalWorkflow> = new Map();
  private approvalRequests: Map<string, ApprovalRequest> = new Map();
  private notifications: Map<string, Notification[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create sample project
    const sampleProject: CollaborationProject = {
      id: "project_1",
      name: "Summer Campaign 2024",
      description: "Q3 marketing campaign targeting young professionals",
      tenantId: "tenant_demo",
      ownerId: "user_1",
      status: "active",
      priority: "high",
      startDate: "2024-06-01",
      dueDate: "2024-08-31",
      progress: 67,
      members: [
        {
          userId: "user_1",
          name: "Project Manager",
          email: "pm@demo-agency.com",
          role: "owner",
          permissions: ["read", "write", "delete", "manage"],
          joinedAt: "2024-06-01T00:00:00Z",
        },
        {
          userId: "user_2",
          name: "Creative Director",
          email: "creative@demo-agency.com",
          role: "admin",
          permissions: ["read", "write"],
          joinedAt: "2024-06-02T00:00:00Z",
        },
      ],
      tasks: [
        {
          id: "task_1",
          projectId: "project_1",
          title: "Audience Research & Analysis",
          description:
            "Research target demographics and create audience personas",
          assigneeId: "user_2",
          assigneeName: "Creative Director",
          status: "completed",
          priority: "high",
          dueDate: "2024-06-15",
          completedAt: "2024-06-14T10:30:00Z",
          estimatedHours: 16,
          actualHours: 14,
          dependencies: [],
          attachments: [],
          comments: [],
          checklist: [
            {
              id: "check_1",
              text: "Demographic analysis",
              completed: true,
              completedBy: "user_2",
              completedAt: "2024-06-12T09:00:00Z",
            },
            {
              id: "check_2",
              text: "Competitor research",
              completed: true,
              completedBy: "user_2",
              completedAt: "2024-06-13T14:00:00Z",
            },
            {
              id: "check_3",
              text: "Persona documentation",
              completed: true,
              completedBy: "user_2",
              completedAt: "2024-06-14T10:00:00Z",
            },
          ],
          tags: ["research", "audience"],
          createdBy: "user_1",
          createdAt: "2024-06-01T09:00:00Z",
          updatedAt: "2024-06-14T10:30:00Z",
        },
      ],
      assets: [],
      comments: [],
      templates: [],
      tags: ["campaign", "summer", "q3"],
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    };

    this.projects.set(sampleProject.id, sampleProject);

    // Create sample workflow
    const sampleWorkflow: ApprovalWorkflow = {
      id: "workflow_1",
      name: "Campaign Approval Process",
      resourceType: "campaign",
      steps: [
        {
          id: "step_1",
          name: "Creative Review",
          approvers: ["user_2"],
          requiresAll: true,
          order: 1,
        },
        {
          id: "step_2",
          name: "Budget Approval",
          approvers: ["user_1"],
          requiresAll: true,
          order: 2,
        },
      ],
      isActive: true,
      createdBy: "user_1",
      createdAt: "2024-01-01T00:00:00Z",
    };

    this.workflows.set(sampleWorkflow.id, sampleWorkflow);
  }

  // Project Management
  public async createProject(
    projectData: Omit<CollaborationProject, "id" | "createdAt" | "updatedAt">,
  ): Promise<CollaborationProject> {
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const project: CollaborationProject = {
      id,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.set(id, project);
    return project;
  }

  public async getProject(
    projectId: string,
  ): Promise<CollaborationProject | null> {
    return this.projects.get(projectId) || null;
  }

  public async updateProject(
    projectId: string,
    updates: Partial<CollaborationProject>,
  ): Promise<CollaborationProject | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.projects.set(projectId, updatedProject);
    return updatedProject;
  }

  public async addProjectMember(
    projectId: string,
    member: Omit<ProjectMember, "joinedAt">,
  ): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const newMember: ProjectMember = {
      ...member,
      joinedAt: new Date().toISOString(),
    };

    project.members.push(newMember);
    project.updatedAt = new Date().toISOString();

    this.projects.set(projectId, project);
    return true;
  }

  public async removeProjectMember(
    projectId: string,
    userId: string,
  ): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) return false;

    project.members = project.members.filter(
      (member) => member.userId !== userId,
    );
    project.updatedAt = new Date().toISOString();

    this.projects.set(projectId, project);
    return true;
  }

  // Task Management
  public async createTask(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ): Promise<Task> {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const task: Task = {
      id,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const project = this.projects.get(task.projectId);
    if (project) {
      project.tasks.push(task);
      this.projects.set(project.id, project);
    }

    // Notify assignee
    if (task.assigneeId) {
      this.createNotification(task.assigneeId, {
        type: "assignment",
        title: "New Task Assigned",
        message: `You have been assigned: ${task.title}`,
        resourceType: "task",
        resourceId: task.id,
      });
    }

    return task;
  }

  public async updateTask(
    taskId: string,
    updates: Partial<Task>,
  ): Promise<Task | null> {
    // Find project containing the task
    for (const project of this.projects.values()) {
      const taskIndex = project.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        const updatedTask = {
          ...project.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        project.tasks[taskIndex] = updatedTask;
        project.updatedAt = new Date().toISOString();
        this.projects.set(project.id, project);

        return updatedTask;
      }
    }

    return null;
  }

  public async addTaskComment(
    taskId: string,
    comment: Omit<Comment, "id" | "createdAt" | "updatedAt">,
  ): Promise<Comment | null> {
    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Find project and task
    for (const project of this.projects.values()) {
      const task = project.tasks.find((t) => t.id === taskId);
      if (task) {
        task.comments.push(newComment);
        this.projects.set(project.id, project);

        // Notify mentioned users
        comment.mentions.forEach((userId) => {
          this.createNotification(userId, {
            type: "mention",
            title: "You were mentioned",
            message: `${comment.authorName} mentioned you in a comment`,
            resourceType: "task",
            resourceId: taskId,
          });
        });

        return newComment;
      }
    }

    return null;
  }

  // Asset Management
  public async uploadAsset(
    assetData: Omit<
      ProjectAsset,
      | "id"
      | "uploadedAt"
      | "lastModified"
      | "version"
      | "versions"
      | "approvals"
    >,
  ): Promise<ProjectAsset> {
    const id = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const asset: ProjectAsset = {
      id,
      ...assetData,
      version: 1,
      versions: [],
      approvals: [],
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const project = this.projects.get(asset.projectId);
    if (project) {
      project.assets.push(asset);
      this.projects.set(project.id, project);
    }

    return asset;
  }

  public async requestAssetApproval(
    assetId: string,
    approvers: string[],
  ): Promise<boolean> {
    // Find asset and create approval requests
    for (const project of this.projects.values()) {
      const asset = project.assets.find((a) => a.id === assetId);
      if (asset) {
        asset.approvalStatus = "pending";

        // Notify approvers
        approvers.forEach((approverId) => {
          this.createNotification(approverId, {
            type: "approval",
            title: "Asset Approval Required",
            message: `Please review and approve: ${asset.name}`,
            resourceType: "asset",
            resourceId: assetId,
          });
        });

        this.projects.set(project.id, project);
        return true;
      }
    }

    return false;
  }

  // Workflow Management
  public async createApprovalWorkflow(
    workflowData: Omit<ApprovalWorkflow, "id" | "createdAt">,
  ): Promise<ApprovalWorkflow> {
    const id = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const workflow: ApprovalWorkflow = {
      id,
      ...workflowData,
      createdAt: new Date().toISOString(),
    };

    this.workflows.set(id, workflow);
    return workflow;
  }

  public async requestApproval(
    workflowId: string,
    resourceType: string,
    resourceId: string,
    resourceName: string,
    requestedBy: string,
  ): Promise<ApprovalRequest> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error("Workflow not found");
    }

    const id = `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const approvalRequest: ApprovalRequest = {
      id,
      workflowId,
      resourceType,
      resourceId,
      resourceName,
      requestedBy,
      requestedAt: new Date().toISOString(),
      currentStep: 0,
      status: "pending",
      approvals: workflow.steps.map((step) => ({
        stepId: step.id,
        approverId: step.approvers[0], // Simplified for demo
        approverName: "Approver Name",
        status: "pending",
      })),
      comments: [],
    };

    this.approvalRequests.set(id, approvalRequest);

    // Notify first step approvers
    const firstStep = workflow.steps[0];
    firstStep.approvers.forEach((approverId) => {
      this.createNotification(approverId, {
        type: "approval",
        title: "Approval Required",
        message: `${resourceName} requires your approval`,
        resourceType,
        resourceId: approvalRequest.id,
      });
    });

    return approvalRequest;
  }

  public async processApproval(
    approvalRequestId: string,
    approverId: string,
    status: "approved" | "rejected",
    feedback?: string,
  ): Promise<ApprovalRequest | null> {
    const approvalRequest = this.approvalRequests.get(approvalRequestId);
    if (!approvalRequest) return null;

    const currentApproval = approvalRequest.approvals.find(
      (a) =>
        a.stepId ===
          approvalRequest.approvals[approvalRequest.currentStep]?.stepId &&
        a.approverId === approverId,
    );

    if (currentApproval) {
      currentApproval.status = status;
      currentApproval.feedback = feedback;
      currentApproval.timestamp = new Date().toISOString();

      if (status === "rejected") {
        approvalRequest.status = "rejected";
      } else {
        // Check if current step is complete
        const currentStepApprovals = approvalRequest.approvals.filter(
          (a) => a.stepId === currentApproval.stepId,
        );

        if (currentStepApprovals.every((a) => a.status === "approved")) {
          approvalRequest.currentStep += 1;

          if (approvalRequest.currentStep >= approvalRequest.approvals.length) {
            approvalRequest.status = "approved";
          }
        }
      }

      this.approvalRequests.set(approvalRequestId, approvalRequest);
    }

    return approvalRequest;
  }

  // Notification Management
  private createNotification(
    userId: string,
    notificationData: Omit<
      Notification,
      "id" | "userId" | "isRead" | "createdAt"
    >,
  ): void {
    const notification: Notification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      ...notificationData,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.unshift(notification);
    this.notifications.set(userId, userNotifications.slice(0, 50)); // Keep last 50 notifications
  }

  public async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications.get(userId) || [];
  }

  public async markNotificationAsRead(
    notificationId: string,
    userId: string,
  ): Promise<boolean> {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return false;

    const notification = userNotifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(userId, userNotifications);
      return true;
    }

    return false;
  }

  // Utility Methods
  public async getProjectsByUser(
    userId: string,
  ): Promise<CollaborationProject[]> {
    return Array.from(this.projects.values()).filter((project) =>
      project.members.some((member) => member.userId === userId),
    );
  }

  public async getTasksByUser(userId: string): Promise<Task[]> {
    const tasks: Task[] = [];

    for (const project of this.projects.values()) {
      const userTasks = project.tasks.filter(
        (task) => task.assigneeId === userId,
      );
      tasks.push(...userTasks);
    }

    return tasks.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  public async getProjectAnalytics(projectId: string): Promise<{
    tasksCompleted: number;
    tasksTotal: number;
    averageTaskDuration: number;
    memberActivity: Array<{
      userId: string;
      name: string;
      tasksCompleted: number;
    }>;
  } | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const tasksCompleted = project.tasks.filter(
      (t) => t.status === "completed",
    ).length;
    const tasksTotal = project.tasks.length;

    const completedTasks = project.tasks.filter(
      (t) => t.status === "completed" && t.actualHours,
    );
    const averageTaskDuration =
      completedTasks.length > 0
        ? completedTasks.reduce(
            (sum, task) => sum + (task.actualHours || 0),
            0,
          ) / completedTasks.length
        : 0;

    const memberActivity = project.members.map((member) => ({
      userId: member.userId,
      name: member.name,
      tasksCompleted: project.tasks.filter(
        (t) => t.assigneeId === member.userId && t.status === "completed",
      ).length,
    }));

    return {
      tasksCompleted,
      tasksTotal,
      averageTaskDuration,
      memberActivity,
    };
  }
}

export const collaborationService = new CollaborationService();
