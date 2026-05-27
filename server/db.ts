import fs from "fs";
import path from "path";
import { User, Project, Agent, Asset } from "../src/types";

const DB_FILE = path.join(process.cwd(), "database.json");

// Define Initial 10 Marketing Agents
export const INITIAL_AGENTS: Agent[] = [
  {
    _id: "agent-ad-copywriter",
    name: "Ad Copywriter Pro",
    description: "Generates high-converting copy variants for Facebook, Instagram, LinkedIn, and Google Ads.",
    category: "content",
    icon: "Megaphone",
    outputFormat: "text",
    promptTemplate: "You are an elite, high-converting direct-response media buyer and copywriter. Generate 3 copy variants (Short style, Question style, Storytelling style) based on the brand: {brand}, target audience: {targetAudience}, tone: {tone}, and unique product feature: {productFeature}. Provide hooks, body copy, and clear Call-to-Actions.",
    inputs: [
      { name: "productFeature", label: "Product Feature / Offer", placeholder: "e.g., 50% off summer collection, or premium wireless earbuds", type: "text", required: true }
    ]
  },
  {
    _id: "agent-seo-blog",
    name: "SEO Blog Architect",
    description: "Constructs highly detailed SEO-optimized blog outlines and keyword clusters.",
    category: "seo",
    icon: "Search",
    outputFormat: "text",
    promptTemplate: "You are an expert SEO Strategist. Build a comprehensive blog post blueprint for the topic: '{topic}' matching the brand '{brand}' and appealing to '{targetAudience}'. Detail: 1. Catchy SEO Title options. 2. A keyword cluster of 15 secondary search terms. 3. Heading structure (H1, H2, H3) with brief bullet directions for each. 4. Recommended meta description.",
    inputs: [
      { name: "topic", label: "Blog Topic / Main Focus", placeholder: "e.g., Benefits of organic Matcha tea", type: "text", required: true }
    ]
  },
  {
    _id: "agent-social-ideas",
    name: "Viral Social Planner",
    description: "Produces weekly calendars of viral reels hooks, interactive threads, and high-impact captions.",
    category: "social",
    icon: "Share2",
    outputFormat: "text",
    promptTemplate: "You are a social growth specialist. Draft a 5-day post schedule targeting '{targetAudience}' with tone '{tone}' for brand '{brand}'. Each post should contain: a Day number, platform recommendation, attention-grabbing HOOK (reels, threads or carousel), complete caption with 5 relevant hashtags, and user action prompt.",
    inputs: [
      { name: "brandGoal", label: "Weekly Growth Goal", placeholder: "e.g., Explain technical features simply, or boost engagement", type: "text", required: true }
    ]
  },
  {
    _id: "agent-email-outreach",
    name: "Email Sales Crafter",
    description: "Drafts persuasive cold outreach sequences or weekly authority-building newsletters.",
    category: "content",
    icon: "Mail",
    outputFormat: "text",
    promptTemplate: "You are a master email marketer. Create a 3-step email campaign sequence for brand '{brand}' to sell '{offer}'. The target audience is: '{targetAudience}'. Keep the tone '{tone}'. Format with subject line options, preview text, email body (brief, double-spaced for readability), and high-contrast CTA links.",
    inputs: [
      { name: "offer", label: "Email Offer / Pitch", placeholder: "e.g., Book a free 15-minute consultation", type: "text", required: true }
    ]
  },
  {
    _id: "agent-tone-tuner",
    name: "Brand Voice Harmonizer",
    description: "Establishes a unified corporate voice, brand vocabulary guidelines, and positioning matrix.",
    category: "strategy",
    icon: "Sparkles",
    outputFormat: "text",
    promptTemplate: "You are a senior brand consultant. Analyze this raw input about brand: '{brand}' with key attributes: '{brandAttributes}'. Generate: 1. Core Brand Persona. 2. A positioning statement. 3. Words to ALWAYS use / Words to NEVER use. 4. Practical style-guide instructions for copywriters.",
    inputs: [
      { name: "brandAttributes", label: "Core Values & Adjectives", placeholder: "e.g., bold, modern, slightly playful, transparent", type: "textarea", required: true }
    ]
  },
  {
    _id: "agent-product-descriptor",
    name: "Product Benefit Mapper",
    description: "Transforms technical properties into emotionally compelling, benefit-focused descriptions.",
    category: "content",
    icon: "FileText",
    outputFormat: "text",
    promptTemplate: "You are an e-commerce branding strategist. Turn the technical details '{techDetails}' of a product for brand '{brand}' into a benefit-centric product description targeting '{targetAudience}'. Outline: 1. Dynamic Headline, 2. Emotional hook, 3. 4-bullet benefit list mapping specs to lifestyle advantages, 4. Urgency-driven close.",
    inputs: [
      { name: "techDetails", label: "Technical Specs / Raw details", placeholder: "e.g., 5000mAh battery, active noise cancellation, lightweight, recycled aluminum", type: "textarea", required: true }
    ]
  },
  {
    _id: "agent-go-to-market",
    name: "30-Day Launch Strategist",
    description: "Drafts hyper-tactical launch plans, channels to prioritize, and KPI tracking matrices.",
    category: "strategy",
    icon: "Compass",
    outputFormat: "text",
    promptTemplate: "You are a Chief Marketing Officer. Build a hyper-focus 30-day Go-To-Market strategy for launching product '{productLaunch}' under brand '{brand}' to '{targetAudience}'. Structure inside weekly milestones: Week 1: Buzz building, Week 2: Launch event/mechanisms, Week 3: Social amplification, Week 4: Retargeting/Loyalty. Include key metrics (KPIs) for each week.",
    inputs: [
      { name: "productLaunch", label: "Product or Feature to Launch", placeholder: "e.g., Mobile personal finance app for students", type: "text", required: true }
    ]
  },
  {
    _id: "agent-press-release",
    name: "PR Broadcast Officer",
    description: "Drafts formal corporate announcements, media pitches, and executive quote packages.",
    category: "social",
    icon: "FileDigit",
    outputFormat: "text",
    promptTemplate: "You are a corporate communications consultant. Write an official Press Release regarding '{announcement}' from brand '{brand}'. Target audience is: '{targetAudience}'. Make the tone '{tone}'. Format exactly with FOR IMMEDIATE RELEASE, Dateline, Headline, Subheadline, Body copy with 2 realistic executive quotes, and standard corporate Boilerplate description.",
    inputs: [
      { name: "announcement", label: "Core News Announcement", placeholder: "e.g., Raised $3M Series Seed, or launching eco-friendly packaging", type: "textarea", required: true }
    ]
  },
  {
    _id: "agent-prompt-engineer",
    name: "Visual Prompt Architect",
    description: "Translates marketing concepts into stunning visual directives for AI image generators.",
    category: "visual",
    icon: "Image",
    outputFormat: "image",
    promptTemplate: "You are an artistic director and AI prompt designer. Translate the concept: '{visualConcept}' for brand '{brand}' targeting '{targetAudience}' into 3 highly detailed, photographic visual prompts. Specify lighting (cinematic, warm/golden hour, volumetric), lens details, color grading styles, compositions (macro, flat lay, portrait), and descriptive keywords to use in Imagen / Midjourney.",
    inputs: [
      { name: "visualConcept", label: "Visual Concept / Vibe", placeholder: "e.g., Fresh running shoe floating in bio-luminescent water", type: "text", required: true }
    ]
  },
  {
    _id: "agent-competitor-auditor",
    name: "Competitor positioning Auditor",
    description: "Dissects direct competitors weaknesses to form custom tactical counter-messaging frames.",
    category: "strategy",
    icon: "Activity",
    outputFormat: "text",
    promptTemplate: "You are a competitive intelligence director. Audit top competitors of '{brand}' in category '{productCategory}'. Core customer pain point: '{painPoint}'. Provide: 1. Competitor positioning gaps. 2. Emotional counter-hook concepts. 3. Standard 'Us vs Them' objection handlers for your sales & web copy.",
    inputs: [
      { name: "productCategory", label: "Product Category / Competitors", placeholder: "e.g., Premium local organic food delivery", type: "text", required: true },
      { name: "painPoint", label: "Main Customer Complaint", placeholder: "e.g., Late delivery, wilted herbs, or plastic packaging", type: "text", required: true }
    ]
  }
];

interface DBStructure {
  users: User[];
  projects: Project[];
  agents: Agent[];
  assets: Asset[];
  canvasStates: { [projectId: string]: { nodes: any[]; connections: any[] } };
}

function loadDB(): DBStructure {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      // Ensure agents are preserved/updated
      parsed.agents = INITIAL_AGENTS;
      if (!parsed.canvasStates) parsed.canvasStates = {};
      return parsed;
    }
  } catch (error) {
    console.error("Error loading database, returning default:", error);
  }

  const defaultDB: DBStructure = {
    users: [],
    projects: [],
    agents: INITIAL_AGENTS,
    assets: [],
    canvasStates: {}
  };
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(db: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to database file:", error);
  }
}

export const dbStore = {
  getUsers: () => loadDB().users,
  getUserById: (id: string) => loadDB().users.find((u) => u._id === id),
  getUserByEmail: (email: string) => loadDB().users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  addUser: (user: User) => {
    const db = loadDB();
    db.users.push(user);
    saveDB(db);
    return user;
  },
  updateUser: (id: string, updates: Partial<User>) => {
    const db = loadDB();
    const idx = db.users.findIndex((u) => u._id === id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDB(db);
      return db.users[idx];
    }
    return null;
  },

  getProjects: (userId: string) => {
    const db = loadDB();
    return db.projects.filter((p) => p.userId === userId);
  },
  getProjectById: (id: string) => loadDB().projects.find((p) => p._id === id),
  addProject: (project: Project) => {
    const db = loadDB();
    db.projects.push(project);
    saveDB(db);
    return project;
  },
  updateProject: (id: string, updates: Partial<Project>) => {
    const db = loadDB();
    const idx = db.projects.findIndex((p) => p._id === id);
    if (idx !== -1) {
      db.projects[idx] = { ...db.projects[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDB(db);
      return db.projects[idx];
    }
    return null;
  },
  deleteProject: (id: string) => {
    const db = loadDB();
    db.projects = db.projects.filter((p) => p._id !== id);
    delete db.canvasStates[id];
    saveDB(db);
    return true;
  },

  getAgents: () => loadDB().agents,
  getAgentById: (id: string) => loadDB().agents.find((a) => a._id === id),

  getAssets: (userId: string) => {
    const db = loadDB();
    return db.assets.filter((as) => as.userId === userId);
  },
  getAssetsByProject: (projectId: string) => {
    const db = loadDB();
    return db.assets.filter((as) => as.projectId === projectId);
  },
  getAssetById: (id: string) => loadDB().assets.find((as) => as._id === id),
  addAsset: (asset: Asset) => {
    const db = loadDB();
    db.assets.unshift(asset); // put newest first
    saveDB(db);
    return asset;
  },
  deleteAsset: (id: string) => {
    const db = loadDB();
    db.assets = db.assets.filter((as) => as._id !== id);
    saveDB(db);
    return true;
  },

  getCanvasState: (projectId: string) => {
    const db = loadDB();
    return db.canvasStates[projectId] || { nodes: [], connections: [] };
  },
  saveCanvasState: (projectId: string, canvasState: { nodes: any[]; connections: any[] }) => {
    const db = loadDB();
    db.canvasStates[projectId] = canvasState;
    // Also sync the unique agent IDs used in this canvas into the Project's agents array
    const agentIds = Array.from(new Set(canvasState.nodes.map(n => n.agentId)));
    const projIdx = db.projects.findIndex((p) => p._id === projectId);
    if (projIdx !== -1) {
      db.projects[projIdx].agents = agentIds;
    }
    saveDB(db);
    return canvasState;
  }
};
