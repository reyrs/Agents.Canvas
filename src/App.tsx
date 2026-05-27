import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Megaphone, ArrowRight, CornerDownRight, Check, Play, RefreshCw, X, FolderKanban, Plus, UserCheck, AlertCircle, Eye, Info 
} from "lucide-react";
import { User, Project, Agent, Asset, CanvasState } from "./types";

// Import landing layout blocks
import Hero from "./components/landing/Hero";
import HowItWorks from "./components/landing/HowItWorks";
import Agents from "./components/landing/Agents";
import Features from "./components/landing/Features";
import Testimonials from "./components/landing/Testimonials";
import Pricing from "./components/landing/Pricing";

// Import Dashboard controls
import Sidebar from "./components/dashboard/Sidebar";
import Canvas from "./components/dashboard/Canvas";
import AgentModal from "./components/dashboard/AgentModal";
import OutputPreview from "./components/dashboard/OutputPreview";

export default function App() {
  // Views navigation state: "landing" | "onboarding" | "dashboard"
  const [view, setView] = useState<"landing" | "onboarding" | "dashboard">("landing");
  
  // Sidebar options matching views: "canvas" | "campaigns" | "assets" | "account"
  const [dashboardSubView, setDashboardSubView] = useState<string>("canvas");

  // Authentication Context State
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Persistence fall-back token keeper
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem("canvas_auth_token"));

  // Application Data lists
  const [agents, setAgents] = useState<Agent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  
  // Active selected asset and node for Output rendering
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);
  const [activeNodeAgent, setActiveNodeAgent] = useState<Agent | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const [activeConfigureModalAgent, setActiveConfigureModalAgent] = useState<Agent | null>(null);

  // Active workspace canvas visual state
  const [canvasState, setCanvasState] = useState<CanvasState>({ nodes: [], connections: [] });
  const [canvasSaving, setCanvasSaving] = useState(false);

  // Onboarding settings details
  const [onboardingBrand, setOnboardingBrand] = useState("");
  const [onboardingTone, setOnboardingTone] = useState("Friendly, confident, and highly efficient");
  const [onboardingAudience, setOnboardingAudience] = useState("Busy entrepreneurs and marketing managers aged 25-45");
  const [onboardingDesc, setOnboardingDesc] = useState("Omni-channel strategy builder launching early summer campaigns.");
  const [onboardingProjName, setOnboardingProjName] = useState("Product Launch Campaign");

  // Pricing integration states
  const [pricingActivePlan, setPricingActivePlan] = useState("free");
  const [pricingUpgradeLoading, setPricingUpgradeLoading] = useState(false);

  // Load baseline resources
  useEffect(() => {
    // 1. Fetch available agents catalog
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(data))
      .catch((err) => console.error("Error loading agent catalog:", err));

    // 2. Validate current session if auth token exists
    if (authToken) {
      syncSession(authToken);
    }
  }, [authToken]);

  // Session synchronized handler helper
  const syncSession = async (token: string) => {
    try {
      const response = await fetch("/api/auth/session", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        setPricingActivePlan(data.user.subscription.plan);
        loadUserProjects(data.user._id, token);
        loadUserAssets(token);
      } else {
        // expired sandbox user token
        setAuthToken(null);
        localStorage.removeItem("canvas_auth_token");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadUserProjects = async (userId: string, token: string) => {
    try {
      const res = await fetch("/api/projects", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setProjects(data);
      if (data.length > 0) {
        // Default to first active campaign or seeded SaaS template
        setCurrentProject(data[0]);
        loadCanvasState(data[0]._id, token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadUserAssets = async (token: string) => {
    try {
      const res = await fetch("/api/assets", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setAssets(data);
      if (data.length > 0) {
        setActiveAsset(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadCanvasState = async (projId: string, token: string) => {
    try {
      const res = await fetch(`/api/projects/${projId}/canvas`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setCanvasState(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCanvasState = async () => {
    if (!currentProject || !authToken) return;
    setCanvasSaving(true);
    try {
      const res = await fetch(`/api/projects/${currentProject._id}/canvas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(canvasState)
      });
      await res.json();
    } catch (err) {
      console.error(err);
    }
    setCanvasSaving(false);
  };

  // Auth Operations
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const isLogin = authModal === "login";
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin 
      ? { email: authEmail, password: authPassword }
      : { email: authEmail, password: authPassword, name: authName };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.status >= 400) {
        setAuthError(data.error || "Authentication failed. Provide valid values.");
      } else {
        const authedUser = data.user;
        setUser(authedUser);
        setAuthToken(authedUser._id);
        localStorage.setItem("canvas_auth_token", authedUser._id);
        setPricingActivePlan(authedUser.subscription.plan);
        setAuthModal(null);

        // Fetch assets or projects
        await syncSession(authedUser._id);

        if (isLogin) {
          setView("dashboard");
          setDashboardSubView("canvas");
        } else {
          // If register complete, redirect straight to onboarding form wizard!
          setView("onboarding");
        }
      }
    } catch (err: any) {
      setAuthError("Failed to communicate with authentication services: " + err.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("canvas_auth_token");
    setProjects([]);
    setAssets([]);
    setCurrentProject(null);
    setActiveAsset(null);
    setView("landing");
  };

  // Onboarding Wizard setting submissions
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingBrand || !authToken) {
      alert("Please provide at least a brand name.");
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: onboardingProjName,
          description: onboardingDesc,
          settings: {
            brand: onboardingBrand,
            tone: onboardingTone,
            targetAudience: onboardingAudience
          }
        })
      });
      const newProj = await res.json();
      setProjects((prev) => [...prev, newProj]);
      setCurrentProject(newProj);

      // Deploy active seed templates so the new user starts with 3 cool nodes already connected!
      const defaultState = {
        nodes: [
          { id: "node-1", agentId: "agent-tone-tuner", x: 120, y: 150 },
          { id: "node-2", agentId: "agent-ad-copywriter", x: 420, y: 100 },
          { id: "node-3", agentId: "agent-seo-blog", x: 420, y: 280 }
        ],
        connections: [
          { id: "conn-1", fromNodeId: "node-1", toNodeId: "node-2" },
          { id: "conn-2", fromNodeId: "node-1", toNodeId: "node-3" }
        ]
      };

      const canvasRes = await fetch(`/api/projects/${newProj._id}/canvas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(defaultState)
      });
      const finalState = await canvasRes.json();
      setCanvasState(finalState);

      // Complete redirect access
      setView("dashboard");
      setDashboardSubView("canvas");
    } catch (err) {
      console.error(err);
    }
  };

  // Switch Campaigns from Settings page
  const handleSelectProject = (projId: string) => {
    const proj = projects.find(p => p._id === projId);
    if (proj && authToken) {
      setCurrentProject(proj);
      loadCanvasState(proj._id, authToken);
      setDashboardSubView("canvas");
    }
  };

  // Create clean brand project campaign
  const handleCreateNewProjectInDashboard = async (name: string, brand: string) => {
    if (!authToken) return;
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: name || "Sprint Launch campaign",
          settings: {
            brand: brand || "CompanyAlpha",
            tone: "Assertive and highly professional",
            targetAudience: "General targeted audience"
          }
        })
      });
      const data = await res.json();
      setProjects((prev) => [...prev, data]);
      setCurrentProject(data);
      setCanvasState({ nodes: [], connections: [] });
      setDashboardSubView("canvas");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProjectSettings = async (updates: Partial<Project>) => {
    if (!currentProject || !authToken) return;
    try {
      const res = await fetch(`/api/projects/${currentProject._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setProjects(prev => prev.map(p => p._id === updated._id ? updated : p));
      setCurrentProject(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // Run content generation
  const handleGenerateCampaignContent = async (inputs: Record<string, string>) => {
    if (!activeConfigureModalAgent || !currentProject || !authToken) return;

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({
        agentId: activeConfigureModalAgent._id,
        projectId: currentProject._id,
        inputs
      })
    });

    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(data.error || "Generation endpoint met an issue.");
    }

    // Spend credits, update user context state
    await syncSession(authToken);
    
    // Refresh asset lists
    await loadUserAssets(authToken);

    const matchAsset = assets.find(as => as._id === data.assetId);
    if (matchAsset) {
      setActiveAsset(matchAsset);
    } else {
      // safe fallback before state re-registers list from API
      setActiveAsset({
        _id: data.assetId,
        userId: user?._id || "authed",
        projectId: currentProject._id,
        agentId: activeConfigureModalAgent._id,
        title: `${activeConfigureModalAgent.name} Output`,
        content: data.content,
        contentType: activeConfigureModalAgent.outputFormat === "image" ? "image" : "text",
        tags: [activeConfigureModalAgent.category],
        createdAt: new Date().toISOString()
      });
    }

    setActiveNodeAgent(activeConfigureModalAgent);
  };

  // Inline assets corrections
  const handleUpdateAssetContent = async (assetId: string, text: string) => {
    if (!authToken) return;
    
    // Simulate immediate backend file editing or syncing
    setAssets((prev) => prev.map(a => a._id === assetId ? { ...a, content: text } : a));
    if (activeAsset?._id === assetId) {
      setActiveAsset(prev => prev ? { ...prev, content: text } : null);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!authToken) return;
    if (!confirm("Are you sure you want to permanently delete this generated marketing asset?")) return;

    try {
      await fetch(`/api/assets/${assetId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      setAssets((prev) => prev.filter(a => a._id !== assetId));
      if (activeAsset?._id === assetId) {
        setActiveAsset(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Upgrade Pricing Plan trigger (integrated immediately for sandbox demonstration)
  const handleUpgradeAccountPlan = async (plan: string) => {
    if (!authToken) {
      setAuthModal("signup");
      return;
    }
    setPricingUpgradeLoading(true);
    try {
      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      await syncSession(authToken);
      alert(data.message || `Account successfully upgraded to dynamic ${plan.toUpperCase()} tier!`);
    } catch (err) {
      console.error(err);
    }
    setPricingUpgradeLoading(false);
  };

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Landing CTAs
  const handleLandingGetStarted = () => {
    if (authToken) {
      setView("dashboard");
      setDashboardSubView("canvas");
    } else {
      setAuthModal("signup");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col font-sans">
      
      {/* 1. LANDING VIEW VIEWPORTS */}
      {view === "landing" && (
        <div className="bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100 flex-1 flex flex-col">
          {/* Landing Header bar */}
          <header className="fixed top-0 left-0 right-0 z-30 bg-white/85 border-b border-gray-150 backdrop-blur-md px-6 py-4 dark:bg-slate-950/85 dark:border-gray-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5.5 w-5.5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-display font-black tracking-widest text-[#0c0c0d] dark:text-white uppercase text-sm">
                Agents.Canvas
              </span>
            </div>
            
            {/* Nav anchors list */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-300">
              <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">How It Works</a>
              <a href="#agents" className="hover:text-indigo-600 dark:hover:text-indigo-400">Specialist Agents</a>
              <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">Features</a>
              <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400">Pricing Comparison</a>
            </nav>

            <div className="flex items-center gap-2.5">
              {authToken ? (
                <>
                  <button
                    onClick={() => {
                      setView("dashboard");
                      setDashboardSubView("canvas");
                    }}
                    className="rounded-xl bg-indigo-600 px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500"
                  >
                    Enter Workspace
                  </button>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:inline-block rounded-xl border border-gray-250 bg-white px-4 py-2 text-xs font-bold text-gray-750 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    id="landing-signin-btn"
                    onClick={() => setAuthModal("login")}
                    className="rounded-xl border border-gray-250 bg-white px-4 py-2 text-xs font-bold text-gray-750 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  >
                    Login
                  </button>
                  <button
                    id="landing-signup-btn"
                    onClick={() => setAuthModal("signup")}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500"
                  >
                    Join Free
                  </button>
                </>
              )}
            </div>
          </header>

          <main className="flex-grow pt-8">
            <Hero onGetStarted={handleLandingGetStarted} onWatchDemo={() => {
              const el = document.getElementById("how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }} />
            <HowItWorks />
            <Agents />
            <Features />
            <Testimonials />
            <Pricing 
              onUpgrade={handleUpgradeAccountPlan} 
              isLoading={pricingUpgradeLoading} 
              activePlan={pricingActivePlan} 
            />
          </main>

          {/* Footer content */}
          <footer className="border-t border-gray-150 py-10 text-center text-xs text-gray-400 dark:border-gray-900 bg-white dark:bg-slate-950 font-sans">
            <p>© 2026 AI Multi-Agent Campaign Canvas Planner. Sandboxed environment setup on Google AI Studio.</p>
          </footer>
        </div>
      )}

      {/* 2. ONBOARDING SCREEN VIEWPORT */}
      {view === "onboarding" && (
        <div className="flex-1 flex items-center justify-center bg-slate-950 px-4 py-12">
          <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-8 space-y-6 text-left shadow-2xl">
            <div className="space-y-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-900/40 text-indigo-400 font-bold mb-3">🚀</span>
              <h2 className="text-xl font-bold text-white">Let&apos;s Build Your First Campaign Project</h2>
              <p className="text-xs text-gray-400 font-sans">Describe your business once. Connected specialized copywriters write matching outputs automatically.</p>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Campaign Project Name</label>
                <input
                  type="text"
                  required
                  value={onboardingProjName}
                  onChange={(e) => setOnboardingProjName(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-gray-250 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., Summer SaaS Promo"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Brand Name</label>
                <input
                  type="text"
                  required
                  value={onboardingBrand}
                  onChange={(e) => setOnboardingBrand(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-gray-250 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., GreenJuice Corp"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Target Customer Base</label>
                <input
                  type="text"
                  required
                  value={onboardingAudience}
                  onChange={(e) => setOnboardingAudience(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-gray-250 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., High-income working mothers aged 30-45"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Tone Settings</label>
                <select
                  value={onboardingTone}
                  onChange={(e) => setOnboardingTone(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2.5 text-xs text-gray-250 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Friendly, confident, and highly efficient">Friendly, confident, and highly efficient</option>
                  <option value="Scientific, detailed, authoritative">Scientific, detailed, authoritative</option>
                  <option value="Bold, witty, borderline disruptive">Bold, witty, borderline disruptive</option>
                  <option value="Empathetic, clear, and reassuring">Empathetic, clear, and reassuring</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-1"
              >
                Access Creative Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. CORE DASHBOARD WORKSPACE VIEWPORT */}
      {view === "dashboard" && (
        <div className="flex-1 flex overflow-hidden bg-slate-950 h-screen">
          <Sidebar
            activeView={dashboardSubView}
            onViewChange={setDashboardSubView}
            user={user}
            onLogout={handleLogout}
            isSidebarOpen={mobileSidebarOpen}
            setIsSidebarOpen={setMobileSidebarOpen}
          />

          <main className="flex-grow flex flex-col overflow-hidden text-left bg-gray-50/50 dark:bg-gray-950 text-gray-800 dark:text-gray-150 relative">
            
            {/* View Sub-selector A: Visual drag Connection grid */}
            {dashboardSubView === "canvas" && currentProject && (
              <div className="flex-grow flex flex-col md:flex-row h-full overflow-hidden">
                <Canvas
                  canvasState={canvasState}
                  onCanvasStateChange={(newSt) => {
                    setCanvasState(newSt);
                  }}
                  agents={agents}
                  project={currentProject}
                  onAgentClick={(agentId, nodeId) => {
                    const matchAgent = agents.find(a => a._id === agentId);
                    if (matchAgent) {
                      setActiveConfigureModalAgent(matchAgent);
                      setActiveNodeId(nodeId);
                    }
                  }}
                  onSaveCanvas={handleSaveCanvasState}
                  isSaving={canvasSaving}
                />
                
                {/* Visual Preview Side panel for Immediate feedback alignment */}
                {activeAsset && (
                  <div className="w-full md:w-[420px] shrink-0 border-t md:border-t-0 md:border-l border-gray-200 bg-white p-4 overflow-y-auto dark:border-gray-800 dark:bg-gray-950 flex flex-col justify-start space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-150 dark:border-gray-800">
                      <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400">Campaign Output Viewer</span>
                      <button
                        onClick={() => setActiveAsset(null)}
                        className="p-1 rounded text-gray-400 hover:text-gray-650 hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Collapse panel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <OutputPreview
                      asset={activeAsset}
                      agent={activeNodeAgent}
                      onClose={() => setActiveAsset(null)}
                      onUpdateAssetContent={handleUpdateAssetContent}
                      onDeleteAsset={handleDeleteAsset}
                      onRegenerate={() => {
                        const targetNode = canvasState.nodes.find(n => n.id === activeNodeId);
                        const matchAgent = agents.find(a => a._id === (targetNode?.agentId || activeAsset.agentId));
                        if (matchAgent) {
                          setActiveConfigureModalAgent(matchAgent);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* View Sub-selector B: Campaigns profile catalog */}
            {dashboardSubView === "campaigns" && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-950 dark:text-white">Your Brands & Campaign Projects</h2>
                    <p className="text-xs text-gray-500 font-sans">Manage separated companies settings, tones, and target contexts.</p>
                  </div>
                  <button
                    onClick={() => {
                      const name = prompt("Enter Campaign Project Name:");
                      const brand = prompt("Enter Company Brand Name:");
                      if (name && brand) {
                        handleCreateNewProjectInDashboard(name, brand);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <Plus className="h-4 w-4" />
                    New Campaign Brand
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {projects.map((p) => {
                    const isSelected = currentProject?._id === p._id;
                    return (
                      <div 
                        id={`project-row-${p._id}`}
                        key={p._id}
                        className={`rounded-2xl border p-5 space-y-4 text-left bg-white dark:bg-gray-950 flex flex-col justify-between ${
                          isSelected ? "border-indigo-500 ring-1 ring-indigo-500/10" : "border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <FolderKanban className="h-4 w-4 text-indigo-500" />
                              {p.name}
                            </h3>
                            {isSelected ? (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                                Active Workspace
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSelectProject(p._id)}
                                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 uppercase border border-indigo-200 px-2 py-0.5 rounded-full"
                              >
                                Select this project
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-gray-500 font-sans leading-relaxed">
                            {p.description || "No project description provided."}
                          </p>

                          <div className="grid grid-cols-2 gap-2.5 pt-2 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                            <div>
                              <span className="block text-gray-400 font-bold uppercase tracking-wider text-[8px]">Brand identity</span>
                              {p.settings.brand}
                            </div>
                            <div>
                              <span className="block text-gray-400 font-bold uppercase tracking-wider text-[8px]">Tone rules</span>
                              {p.settings.tone}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                          <span className="text-[10px] text-gray-400 font-sans">
                            Has {p.agents.length} active canvas agents
                          </span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newAudience = prompt("Update Target Customer Base:", p.settings.targetAudience);
                                if (newAudience) {
                                  handleUpdateProjectSettings({ settings: { ...p.settings, targetAudience: newAudience } });
                                }
                              }}
                              className="text-[10px] font-semibold text-gray-500 hover:text-gray-700"
                            >
                              Edit Audience
                            </button>
                            {!isSelected && (
                              <button
                                onClick={async () => {
                                  if (confirm("Are you sure you want to permanently delete this campaign? All connected visual canvas states and credentials will be removed.")) {
                                    await fetch(`/api/projects/${p._id}`, {
                                      method: "DELETE",
                                      headers: { "Authorization": `Bearer ${authToken}` }
                                    });
                                    setProjects((prev) => prev.filter(proj => proj._id !== p._id));
                                    if (currentProject?._id === p._id) {
                                      setCurrentProject(null);
                                    }
                                  }
                                }}
                                className="text-[10px] font-semibold text-rose-500 hover:text-rose-450 pl-2 border-l border-gray-150"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View Sub-selector C: Asset list Vault */}
            {dashboardSubView === "assets" && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-950 dark:text-white">Your Generated Campaign Assets Vault</h2>
                  <p className="text-xs text-gray-500 font-sans">View, edit, or copy previous creative campaign documents outputs.</p>
                </div>

                {assets.length === 0 ? (
                  <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-12 text-center flex flex-col items-center justify-center space-y-3 dark:border-gray-800 dark:bg-gray-950">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">No generated materials found</h4>
                      <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed font-sans">
                        Configure any node on your active Canvas and press &ldquo;Analyze & Run campaign&rdquo; to populate records here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
                    {/* List section Left column */}
                    <div className="lg:col-span-4 space-y-3 max-h-[75vh] overflow-y-auto">
                      {assets.map((a) => {
                        const isSelectedVal = activeAsset?._id === a._id;
                        const specAgent = agents.find(ag => ag._id === a.agentId);
                        return (
                          <div
                            id={`asset-list-row-${a._id}`}
                            key={a._id}
                            onClick={() => {
                              setActiveAsset(a);
                              if (specAgent) setActiveNodeAgent(specAgent);
                            }}
                            className={`rounded-xl border p-4 text-left cursor-pointer transition-all ${
                              isSelectedVal 
                                ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20" 
                                : "border-gray-150 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950/40"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1.5">
                              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                {a.title}
                              </h4>
                              <span className="text-[9px] font-mono font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                {a.contentType}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-450 truncate mb-2 font-sans leading-none">
                              {a.content.replace(/[#*`>!\[\]()]/g, "").slice(0, 50)}...
                            </p>
                            <span className="text-[9px] text-gray-400">
                              {new Date(a.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Rendering Preview right column */}
                    <div className="lg:col-span-8">
                      {activeAsset ? (
                        <OutputPreview
                          asset={activeAsset}
                          agent={activeNodeAgent}
                          onClose={() => setActiveAsset(null)}
                          onUpdateAssetContent={handleUpdateAssetContent}
                          onDeleteAsset={handleDeleteAsset}
                          onRegenerate={() => {
                            const specAgent = agents.find(ag => ag._id === activeAsset.agentId);
                            if (specAgent) {
                              setActiveConfigureModalAgent(specAgent);
                            }
                          }}
                        />
                      ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center flex flex-col items-center justify-center space-y-3 dark:border-gray-800 dark:bg-gray-950">
                          <Eye className="h-7 w-7 text-indigo-500" />
                          <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">No Asset Selected for Preview</h4>
                          <p className="text-xs text-gray-400 max-w-xs font-sans">Tap any historical item on the left panel block to preview.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View Sub-selector D: Profile and settings */}
            {dashboardSubView === "account" && user && (
              <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                <div>
                  <h2 className="text-lg font-bold text-gray-950 dark:text-white">Workspace Account & Subscription Details</h2>
                  <p className="text-xs text-gray-500 font-sans font-medium">Verify credit depletion rates and manage subscriber values.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-start">
                  
                  {/* Left profile Column */}
                  <div className="md:col-span-5 rounded-2xl border border-gray-200 bg-white p-5 space-y-4 text-left dark:border-gray-800 dark:bg-gray-950">
                    <div className="flex items-center gap-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="h-14 w-14 rounded-full object-cover border border-gray-200 dark:border-gray-800 shadow"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{user.email}</p>
                        <span className="inline-block mt-2 rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-semibold uppercase">
                          Role: {user.role}
                        </span>
                      </div>
                    </div>

                    <hr className="border-gray-150 dark:border-gray-850" />

                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Account Specifications</h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">User ID</span>
                          <span className="font-mono text-gray-600 dark:text-gray-300">{user._id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subscription Tier</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">{user.subscription.plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Renewal Cycle</span>
                          <span className="text-gray-600 dark:text-gray-300">Annual (365 Days)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Credits Remaining</span>
                          <span className="font-mono font-bold text-emerald-600">{user.subscription.creditsLimit - user.subscription.creditsUsed} tokens</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Pricing cards Column */}
                  <div className="md:col-span-7 rounded-2xl border border-gray-200 bg-white p-5 space-y-4 text-left dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white">Upgrade Active Account limits</h3>
                    <p className="text-xs text-gray-505 dark:text-gray-400 font-sans leading-relaxed">
                      Scale credit limits or unlock advanced visual output image generation blocks instantly. Triggering updates will automatically sync the account state.
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
                      <div className="rounded-xl border border-gray-200 p-4 space-y-2 dark:border-gray-800">
                        <span className="text-[9px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase">Pro Copywriter Plan</span>
                        <h4 className="text-base font-black">$27 / month</h4>
                        <p className="text-[10px] text-gray-400 font-sans">Provides 1,000 monthly credits. Standard priority Gemini.</p>
                        <button
                          onClick={() => handleUpgradeAccountPlan("pro")}
                          disabled={user.subscription.plan === "pro" || user.subscription.plan === "enterprise"}
                          className="w-full mt-3 rounded-lg bg-indigo-600 text-white font-bold text-xs py-2 hover:bg-indigo-500 disabled:opacity-50"
                        >
                          {user.subscription.plan === "pro" ? "Active" : "Activate Pro Tier"}
                        </button>
                      </div>

                      <div className="rounded-xl border border-gray-200 p-4 space-y-2 dark:border-gray-800">
                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Autonomous Agency Plan</span>
                        <h4 className="text-base font-black">$69 / month</h4>
                        <p className="text-[10px] text-gray-400 font-sans">Provides 5,000 monthly credits. Premium Gemini + Image nodes.</p>
                        <button
                          onClick={() => handleUpgradeAccountPlan("enterprise")}
                          disabled={user.subscription.plan === "enterprise"}
                          className="w-full mt-3 rounded-lg bg-emerald-600 text-white font-bold text-xs py-2 hover:bg-emerald-500 disabled:opacity-50"
                        >
                          {user.subscription.plan === "enterprise" ? "Active" : "Activate Enterprise Tier"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-indigo-50/60 p-3 max-w-2xl border border-indigo-100/50 dark:bg-indigo-950/10 dark:border-indigo-500/10 flex gap-2 text-left">
                  <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                  <div className="text-xs text-indigo-900/80 dark:text-indigo-400 leading-relaxed font-sans">
                    <p className="font-bold">Google AI Studio Secrets Alert</p>
                    <p>To run actual production generative AI workflows with infinite sizes, bind a real **GEMINI_API_KEY** in your Settings panel &gt; Secrets in the top bar! The sandbox uses highly detailed mock data models otherwise.</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* 4. PASSABLE SYSTEM POPUPS: LOGIN OR SIGNUP INTERACTIVE WIZARDS */}
      <AnimatePresence>
        {authModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 space-y-5 text-left dark:border-gray-800 dark:bg-gray-950 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {authModal === "login" ? "Welcome Back" : "Create Sandbox Account"}
                  </h3>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">
                    {authModal === "login" ? "Sign in to deploy marketing pipelines." : "Join to experiment with connected models free."}
                  </p>
                </div>
                <button
                  onClick={() => setAuthModal(null)}
                  className="rounded p-0.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {authError && (
                <div className="rounded-xl bg-rose-50 border border-rose-100 p-2.5 flex gap-2 text-left dark:bg-rose-950/20 dark:border-rose-950">
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-rose-700 dark:text-rose-400 font-sans leading-snug">{authError}</p>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authModal === "signup" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3 py-2.5 text-xs text-gray-850 focus:outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      placeholder="Reyhan Resha"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3 py-2.5 text-xs text-gray-850 focus:outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    placeholder="reyhanresha87@gmail.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 font-medium">Password Credentials</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-250 bg-gray-50/50 px-3 py-2.5 text-xs text-gray-850 focus:outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    placeholder="password123"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-1 shadow shadow-indigo-600/10"
                >
                  {authLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1 text-white" />}
                  {authModal === "login" ? "Enter Dashboard" : "Deploy Secure Account"}
                </button>
              </form>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 text-center">
                <button
                  onClick={() => {
                    setAuthError(null);
                    setAuthModal(authModal === "login" ? "signup" : "login");
                  }}
                  className="text-xs text-indigo-500 hover:text-indigo-400 font-semibold tracking-wide"
                >
                  {authModal === "login" ? "Need a workspace account? Register" : "Already registered? Login instead"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. DYNAMIC ACTIVE MODEL WIZARD CONFIGURATION FORM */}
      <AnimatePresence>
        {activeConfigureModalAgent && currentProject && (
          <AgentModal
            agent={activeConfigureModalAgent}
            project={currentProject}
            onClose={() => setActiveConfigureModalAgent(null)}
            onGenerate={handleGenerateCampaignContent}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
