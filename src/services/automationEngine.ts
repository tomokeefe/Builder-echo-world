// Workflow automation engine for marketing campaigns

export interface AutomationTrigger {
  id: string;
  type: "time_based" | "performance_based" | "event_based" | "audience_based";
  name: string;
  description: string;
  conditions: TriggerCondition[];
  enabled: boolean;
}

export interface TriggerCondition {
  field: string;
  operator: "equals" | "greater_than" | "less_than" | "contains" | "between";
  value: any;
  threshold?: number;
}

export interface AutomationAction {
  id: string;
  type:
    | "pause_campaign"
    | "increase_budget"
    | "decrease_budget"
    | "send_alert"
    | "create_audience"
    | "optimize_targeting";
  name: string;
  description: string;
  parameters: Record<string, any>;
  delay?: number; // in minutes
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: "performance" | "budget" | "scheduling" | "optimization";
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
  status: "active" | "paused" | "draft";
  priority: "low" | "medium" | "high" | "critical";
  created: string;
  lastTriggered?: string;
  executionCount: number;
  cooldownPeriod: number; // in minutes
  conditions: "all" | "any"; // whether all triggers must fire or any
}

export interface AutomationExecution {
  id: string;
  ruleId: string;
  triggeredBy: string;
  triggeredAt: string;
  status: "running" | "completed" | "failed" | "cancelled";
  actions: {
    actionId: string;
    status: "pending" | "running" | "completed" | "failed";
    result?: any;
    error?: string;
    executedAt?: string;
  }[];
  logs: {
    timestamp: string;
    level: "info" | "warning" | "error";
    message: string;
    data?: any;
  }[];
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  rules: Omit<
    AutomationRule,
    "id" | "created" | "executionCount" | "lastTriggered"
  >[];
  popularity: number;
  effectiveness: number;
}

// Pre-defined automation templates
export const automationTemplates: AutomationTemplate[] = [
  {
    id: "performance-optimizer",
    name: "Performance Optimizer",
    description:
      "Automatically optimize campaigns based on performance metrics",
    category: "optimization",
    popularity: 95,
    effectiveness: 87,
    rules: [
      {
        name: "Pause Low-Performing Campaigns",
        description:
          "Automatically pause campaigns with low ROAS after 24 hours",
        category: "performance",
        triggers: [
          {
            id: "low-roas-trigger",
            type: "performance_based",
            name: "Low ROAS Trigger",
            description: "Triggers when ROAS falls below threshold",
            conditions: [
              { field: "roas", operator: "less_than", value: 2.0 },
              {
                field: "campaign_runtime",
                operator: "greater_than",
                value: 24,
              },
            ],
            enabled: true,
          },
        ],
        actions: [
          {
            id: "pause-campaign",
            type: "pause_campaign",
            name: "Pause Campaign",
            description: "Pause underperforming campaign",
            parameters: { reason: "Low ROAS detected" },
          },
          {
            id: "send-alert",
            type: "send_alert",
            name: "Send Alert",
            description: "Notify team of paused campaign",
            parameters: {
              recipients: ["manager@company.com"],
              message: "Campaign paused due to low ROAS",
            },
          },
        ],
        status: "active",
        priority: "high",
        executionCount: 0,
        cooldownPeriod: 60,
        conditions: "all",
      },
      {
        name: "Scale High-Performing Campaigns",
        description: "Increase budget for campaigns with high ROAS",
        category: "optimization",
        triggers: [
          {
            id: "high-roas-trigger",
            type: "performance_based",
            name: "High ROAS Trigger",
            description: "Triggers when ROAS exceeds threshold",
            conditions: [
              { field: "roas", operator: "greater_than", value: 5.0 },
              { field: "campaign_spend", operator: "less_than", value: 5000 },
            ],
            enabled: true,
          },
        ],
        actions: [
          {
            id: "increase-budget",
            type: "increase_budget",
            name: "Increase Budget",
            description: "Increase budget by 20%",
            parameters: {
              increase_percentage: 20,
              max_budget: 10000,
            },
          },
        ],
        status: "active",
        priority: "medium",
        executionCount: 0,
        cooldownPeriod: 120,
        conditions: "all",
      },
    ],
  },
  {
    id: "budget-manager",
    name: "Smart Budget Manager",
    description:
      "Automatically manage campaign budgets based on performance and time",
    category: "budget",
    popularity: 88,
    effectiveness: 82,
    rules: [
      {
        name: "Daily Budget Cap",
        description: "Pause campaigns when daily budget is reached",
        category: "budget",
        triggers: [
          {
            id: "budget-cap-trigger",
            type: "performance_based",
            name: "Budget Cap Trigger",
            description: "Triggers when daily spend reaches limit",
            conditions: [
              { field: "daily_spend", operator: "greater_than", value: 1000 },
            ],
            enabled: true,
          },
        ],
        actions: [
          {
            id: "pause-campaign",
            type: "pause_campaign",
            name: "Pause Campaign",
            description: "Pause campaign until tomorrow",
            parameters: {
              reason: "Daily budget limit reached",
              resume_tomorrow: true,
            },
          },
        ],
        status: "active",
        priority: "high",
        executionCount: 0,
        cooldownPeriod: 1440, // 24 hours
        conditions: "all",
      },
    ],
  },
  {
    id: "audience-optimizer",
    name: "Audience Optimizer",
    description: "Optimize audience targeting based on performance data",
    category: "optimization",
    popularity: 76,
    effectiveness: 79,
    rules: [
      {
        name: "Create Lookalike from Converters",
        description:
          "Automatically create lookalike audiences from high-converting customers",
        category: "optimization",
        triggers: [
          {
            id: "conversion-threshold",
            type: "audience_based",
            name: "Conversion Threshold",
            description:
              "Triggers when conversion audience reaches minimum size",
            conditions: [
              { field: "audience_size", operator: "greater_than", value: 1000 },
              {
                field: "conversion_rate",
                operator: "greater_than",
                value: 0.05,
              },
            ],
            enabled: true,
          },
        ],
        actions: [
          {
            id: "create-lookalike",
            type: "create_audience",
            name: "Create Lookalike Audience",
            description: "Create 1% lookalike audience",
            parameters: {
              type: "lookalike",
              similarity: 1,
              source_audience: "converters",
            },
          },
        ],
        status: "active",
        priority: "medium",
        executionCount: 0,
        cooldownPeriod: 1440,
        conditions: "all",
      },
    ],
  },
];

// Automation execution engine
class AutomationEngine {
  private rules: Map<string, AutomationRule> = new Map();
  private executions: Map<string, AutomationExecution> = new Map();
  private isRunning = false;
  private checkInterval = 60000; // 1 minute

  constructor() {
    this.loadRules();
    this.startEngine();
  }

  private loadRules() {
    // Load rules from storage (mock implementation)
    const mockRules: AutomationRule[] = [
      {
        id: "rule-1",
        name: "Pause Low ROAS Campaigns",
        description: "Automatically pause campaigns with ROAS < 2.0",
        category: "performance",
        triggers: [
          {
            id: "trigger-1",
            type: "performance_based",
            name: "Low ROAS Detection",
            description: "Detects campaigns with ROAS below 2.0",
            conditions: [
              { field: "roas", operator: "less_than", value: 2.0 },
              { field: "runtime_hours", operator: "greater_than", value: 24 },
            ],
            enabled: true,
          },
        ],
        actions: [
          {
            id: "action-1",
            type: "pause_campaign",
            name: "Pause Campaign",
            description: "Pause the underperforming campaign",
            parameters: { reason: "Low ROAS detected" },
          },
          {
            id: "action-2",
            type: "send_alert",
            name: "Send Notification",
            description: "Alert the team about the paused campaign",
            parameters: {
              recipients: ["team@company.com"],
              subject: "Campaign Auto-Paused",
            },
          },
        ],
        status: "active",
        priority: "high",
        created: "2024-01-15T10:00:00Z",
        executionCount: 3,
        lastTriggered: "2024-01-20T14:30:00Z",
        cooldownPeriod: 60,
        conditions: "all",
      },
    ];

    mockRules.forEach((rule) => this.rules.set(rule.id, rule));
  }

  startEngine() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.checkRules();

    // Set up periodic rule checking
    setInterval(() => {
      this.checkRules();
    }, this.checkInterval);
  }

  stopEngine() {
    this.isRunning = false;
  }

  private async checkRules() {
    if (!this.isRunning) return;

    for (const [ruleId, rule] of this.rules) {
      if (rule.status !== "active") continue;

      try {
        await this.evaluateRule(rule);
      } catch (error) {
        console.error(`Error evaluating rule ${ruleId}:`, error);
      }
    }
  }

  private async evaluateRule(rule: AutomationRule): Promise<void> {
    // Check cooldown period
    if (rule.lastTriggered) {
      const lastTriggeredTime = new Date(rule.lastTriggered).getTime();
      const cooldownMs = rule.cooldownPeriod * 60 * 1000;
      if (Date.now() - lastTriggeredTime < cooldownMs) {
        return; // Still in cooldown
      }
    }

    // Evaluate triggers
    const triggerResults = await Promise.all(
      rule.triggers.map((trigger) => this.evaluateTrigger(trigger)),
    );

    // Check if rule should fire based on conditions
    const shouldFire =
      rule.conditions === "all"
        ? triggerResults.every((result) => result.fired)
        : triggerResults.some((result) => result.fired);

    if (shouldFire) {
      await this.executeRule(rule, triggerResults);
    }
  }

  private async evaluateTrigger(trigger: AutomationTrigger): Promise<{
    fired: boolean;
    data?: any;
    reason?: string;
  }> {
    if (!trigger.enabled) {
      return { fired: false, reason: "Trigger disabled" };
    }

    // Mock data for demonstration
    const mockCampaignData = {
      roas: Math.random() * 6, // 0-6 ROAS
      runtime_hours: Math.random() * 72, // 0-72 hours
      daily_spend: Math.random() * 2000, // 0-2000
      conversion_rate: Math.random() * 0.1, // 0-10%
      audience_size: Math.floor(Math.random() * 5000), // 0-5000
    };

    // Evaluate all conditions
    const conditionResults = trigger.conditions.map((condition) => {
      const fieldValue =
        mockCampaignData[condition.field as keyof typeof mockCampaignData];
      if (fieldValue === undefined) return false;

      switch (condition.operator) {
        case "equals":
          return fieldValue === condition.value;
        case "greater_than":
          return fieldValue > condition.value;
        case "less_than":
          return fieldValue < condition.value;
        case "contains":
          return String(fieldValue).includes(String(condition.value));
        case "between":
          return (
            Array.isArray(condition.value) &&
            fieldValue >= condition.value[0] &&
            fieldValue <= condition.value[1]
          );
        default:
          return false;
      }
    });

    const fired = conditionResults.every((result) => result);

    return {
      fired,
      data: mockCampaignData,
      reason: fired ? "All conditions met" : "Conditions not met",
    };
  }

  private async executeRule(
    rule: AutomationRule,
    triggerResults: any[],
  ): Promise<void> {
    const executionId = `exec-${Date.now()}`;

    const execution: AutomationExecution = {
      id: executionId,
      ruleId: rule.id,
      triggeredBy: triggerResults.map((r) => r.reason).join(", "),
      triggeredAt: new Date().toISOString(),
      status: "running",
      actions: rule.actions.map((action) => ({
        actionId: action.id,
        status: "pending",
      })),
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: "info",
          message: `Rule "${rule.name}" triggered`,
          data: { triggerResults },
        },
      ],
    };

    this.executions.set(executionId, execution);

    // Execute actions sequentially
    for (const action of rule.actions) {
      try {
        await this.executeAction(action, execution);
      } catch (error) {
        this.addExecutionLog(
          execution,
          "error",
          `Action ${action.name} failed`,
          { error },
        );
      }
    }

    // Update rule
    rule.executionCount++;
    rule.lastTriggered = new Date().toISOString();

    execution.status = "completed";
    this.addExecutionLog(execution, "info", "Rule execution completed");
  }

  private async executeAction(
    action: AutomationAction,
    execution: AutomationExecution,
  ): Promise<void> {
    const actionExecution = execution.actions.find(
      (a) => a.actionId === action.id,
    );
    if (!actionExecution) return;

    actionExecution.status = "running";
    actionExecution.executedAt = new Date().toISOString();

    this.addExecutionLog(execution, "info", `Executing action: ${action.name}`);

    // Add delay if specified
    if (action.delay) {
      await new Promise((resolve) =>
        setTimeout(resolve, action.delay! * 60 * 1000),
      );
    }

    // Simulate action execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    switch (action.type) {
      case "pause_campaign":
        actionExecution.result = {
          campaign_paused: true,
          reason: action.parameters.reason,
        };
        this.addExecutionLog(execution, "info", "Campaign paused successfully");
        break;

      case "increase_budget":
        actionExecution.result = {
          budget_increased: true,
          new_budget: action.parameters.new_budget,
          increase_percentage: action.parameters.increase_percentage,
        };
        this.addExecutionLog(
          execution,
          "info",
          `Budget increased by ${action.parameters.increase_percentage}%`,
        );
        break;

      case "decrease_budget":
        actionExecution.result = {
          budget_decreased: true,
          new_budget: action.parameters.new_budget,
          decrease_percentage: action.parameters.decrease_percentage,
        };
        this.addExecutionLog(
          execution,
          "info",
          `Budget decreased by ${action.parameters.decrease_percentage}%`,
        );
        break;

      case "send_alert":
        actionExecution.result = {
          alert_sent: true,
          recipients: action.parameters.recipients,
          message: action.parameters.message,
        };
        this.addExecutionLog(execution, "info", "Alert sent successfully");
        break;

      case "create_audience":
        actionExecution.result = {
          audience_created: true,
          audience_id: `audience-${Date.now()}`,
          type: action.parameters.type,
        };
        this.addExecutionLog(
          execution,
          "info",
          "Audience created successfully",
        );
        break;

      case "optimize_targeting":
        actionExecution.result = {
          targeting_optimized: true,
          optimizations_applied: action.parameters.optimizations,
        };
        this.addExecutionLog(
          execution,
          "info",
          "Targeting optimized successfully",
        );
        break;

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }

    actionExecution.status = "completed";
  }

  private addExecutionLog(
    execution: AutomationExecution,
    level: AutomationExecution["logs"][0]["level"],
    message: string,
    data?: any,
  ) {
    execution.logs.push({
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    });
  }

  // Public API methods
  addRule(
    rule: Omit<AutomationRule, "id" | "created" | "executionCount">,
  ): string {
    const id = `rule-${Date.now()}`;
    const newRule: AutomationRule = {
      ...rule,
      id,
      created: new Date().toISOString(),
      executionCount: 0,
    };

    this.rules.set(id, newRule);
    return id;
  }

  updateRule(id: string, updates: Partial<AutomationRule>): boolean {
    const rule = this.rules.get(id);
    if (!rule) return false;

    Object.assign(rule, updates);
    return true;
  }

  deleteRule(id: string): boolean {
    return this.rules.delete(id);
  }

  getRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }

  getRule(id: string): AutomationRule | undefined {
    return this.rules.get(id);
  }

  getExecutions(): AutomationExecution[] {
    return Array.from(this.executions.values()).sort(
      (a, b) =>
        new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime(),
    );
  }

  getExecution(id: string): AutomationExecution | undefined {
    return this.executions.get(id);
  }

  pauseRule(id: string): boolean {
    const rule = this.rules.get(id);
    if (!rule) return false;

    rule.status = "paused";
    return true;
  }

  activateRule(id: string): boolean {
    const rule = this.rules.get(id);
    if (!rule) return false;

    rule.status = "active";
    return true;
  }

  getStatistics() {
    const rules = this.getRules();
    const executions = this.getExecutions();

    return {
      totalRules: rules.length,
      activeRules: rules.filter((r) => r.status === "active").length,
      totalExecutions: executions.length,
      successfulExecutions: executions.filter((e) => e.status === "completed")
        .length,
      failedExecutions: executions.filter((e) => e.status === "failed").length,
      averageExecutionsPerRule:
        rules.length > 0 ? executions.length / rules.length : 0,
      mostActiveRule: rules.sort(
        (a, b) => b.executionCount - a.executionCount,
      )[0],
    };
  }
}

// Export singleton instance
export const automationEngine = new AutomationEngine();

export default automationEngine;
