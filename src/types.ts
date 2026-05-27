export type Role = "user" | "admin";
export type SubscriptionPlan = "free" | "pro" | "enterprise";
export type SubscriptionStatus = "active" | "cancelled" | "expired";

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  creditsUsed: number;
  creditsLimit: number;
  startDate: string;
  endDate: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  role: Role;
  subscription: UserSubscription;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = "active" | "archived";

export interface ProjectSettings {
  brand: string;
  tone: string;
  targetAudience: string;
}

export interface Project {
  _id: string;
  userId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  agents: string[]; // Agent IDs present in canvas
  settings: ProjectSettings;
  createdAt: string;
  updatedAt: string;
}

export type AgentCategory = "content" | "social" | "seo" | "visual" | "strategy";
export type OutputFormat = "text" | "image" | "code" | "json";

export interface AgentInputSchema {
  name: string;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required: boolean;
}

export interface Agent {
  _id: string;
  name: string;
  description: string;
  category: AgentCategory;
  icon: string; // Lucide icon name
  promptTemplate: string;
  inputs: AgentInputSchema[];
  outputFormat: OutputFormat;
}

export interface Asset {
  _id: string;
  userId: string;
  projectId: string;
  agentId: string;
  title: string;
  content: string;
  contentType: "text" | "image" | "video";
  storageUrl?: string;
  metadata?: any;
  tags: string[];
  createdAt: string;
}

// Visual Node Canvas Types
export interface CanvasNode {
  id: string;
  agentId: string;
  x: number;
  y: number;
}

export interface CanvasConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}

export interface CanvasState {
  nodes: CanvasNode[];
  connections: CanvasConnection[];
}
