import React from "react";
import { 
  Projector, LayoutGrid, Image, ClipboardList, Settings, CreditCard, LogOut, Menu, X, Sparkles, UserCheck 
} from "lucide-react";
import { User } from "../../types";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  user: User | null;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ 
  activeView, 
  onViewChange, 
  user, 
  onLogout, 
  isSidebarOpen, 
  setIsSidebarOpen 
}: SidebarProps) {
  
  const menuItems = [
    { id: "canvas", label: "Visual Canvas Workspace", icon: <LayoutGrid className="h-4 w-4" /> },
    { id: "campaigns", label: "Change Campaign Settings", icon: <Projector className="h-4 w-4" /> },
    { id: "assets", label: "Campaign Asset Vault", icon: <Image className="h-4 w-4" /> },
    { id: "account", label: "Account Settings", icon: <Settings className="h-4 w-4" /> }
  ];

  const availableCredits = user ? (user.subscription.creditsLimit - user.subscription.creditsUsed) : 0;
  const creditsPercentage = user ? Math.min(100, Math.max(0, (user.subscription.creditsUsed / user.subscription.creditsLimit) * 100)) : 0;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-gray-900 px-4 text-white md:hidden sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <span className="font-display font-black tracking-wider text-sm text-indigo-400">AGENTS.CANVAS</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-lg p-1.5 hover:bg-gray-800 text-gray-300"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar background overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Actual Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-gray-200 bg-gray-900 text-gray-300 transition-all duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Brand Header */}
          <div className="hidden h-16 items-center gap-2.5 px-6 border-b border-gray-800 md:flex">
            <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
            <span className="font-display font-black tracking-widest text-sm text-indigo-400 uppercase">
              Agents.Canvas
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1.5 px-4 py-6">
            {menuItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  id={`sidebar-item-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Core Usage Token Panel */}
          {user && (
            <div className="m-4 rounded-xl bg-gray-950 p-4 border border-gray-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
                  Campaign Balance
                </span>
                <span className="text-emerald-400 font-mono text-[10px] uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {user.subscription.plan} Plan
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-sm font-semibold text-gray-200">
                  <span>{availableCredits} credits left</span>
                  <span className="text-xs text-gray-500">of {user.subscription.creditsLimit}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${100 - creditsPercentage}%` }}
                  />
                </div>
              </div>

              <p className="text-[10px] text-gray-500 leading-snug">
                Spent {user.subscription.creditsUsed} / {user.subscription.creditsLimit} execution tokens this month.
              </p>
            </div>
          )}
        </div>

        {/* User Footer settings */}
        {user && (
          <div className="border-t border-gray-800 bg-gray-950 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 rounded-full object-cover border border-gray-800"
                  onError={(e) => {
                    // Fallback avatar
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150`;
                  }}
                />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-gray-200 leading-none truncate w-28">
                    {user.name}
                  </h4>
                  <span className="text-[10px] text-gray-500 font-mono mt-1 block truncate w-28">
                    {user.email}
                  </span>
                </div>
              </div>

              <button
                id="sidebar-logout-button"
                onClick={onLogout}
                className="rounded-lg p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white"
                title="Log out session"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
