import React, { useState, useRef, useEffect } from "react";
import { 
  Plus, Play, Trash2, Save, Download, AlertCircle, HelpCircle, RefreshCw, ZoomIn, ZoomOut, Check, Sparkles, X 
} from "lucide-react";
import { CanvasNode, CanvasConnection, Agent, CanvasState, Project } from "../../types";
import * as Icons from "lucide-react";

interface CanvasProps {
  canvasState: CanvasState;
  onCanvasStateChange: (state: CanvasState) => void;
  agents: Agent[];
  project: Project;
  onAgentClick: (agentId: string, nodeId: string) => void;
  onSaveCanvas: () => Promise<void>;
  isSaving: boolean;
}

export default function Canvas({
  canvasState,
  onCanvasStateChange,
  agents,
  project,
  onAgentClick,
  onSaveCanvas,
  isSaving
}: CanvasProps) {
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Source connector to build links
  const [linkingNodeId, setLinkingNodeId] = useState<string | null>(null);

  // Context menu position and options
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  // Filter available agents search inside context panel
  const [searchQuery, setSearchQuery] = useState("");

  const [savingNote, setSavingNote] = useState<string | null>(null);

  // Node Drag Handlers
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if ((e.target as HTMLElement).closest(".connector-handle")) return; // skip dragging on connecting handles
    if ((e.target as HTMLElement).closest(".delete-btn")) return; // skip dragging on delete btn
    
    const node = canvasState.nodes.find(n => n.id === nodeId);
    if (!node) return;

    e.preventDefault();
    setDraggedNodeId(nodeId);
    
    // Calculate off-set from click position to top-left of the node card
    const bounding = canvasRef.current?.getBoundingClientRect();
    if (bounding) {
      const mouseXInCanvas = e.clientX - bounding.left;
      const mouseYInCanvas = e.clientY - bounding.top;
      setDragOffset({
        x: mouseXInCanvas - node.x,
        y: mouseYInCanvas - node.y
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId) return;

    const bounding = canvasRef.current?.getBoundingClientRect();
    if (!bounding) return;

    const mouseX = e.clientX - bounding.left;
    const mouseY = e.clientY - bounding.top;

    // Constrain inside bounds of visual container
    let finalX = mouseX - dragOffset.x;
    let finalY = mouseY - dragOffset.y;

    finalX = Math.max(10, Math.min(bounding.width - 210, finalX));
    finalY = Math.max(10, Math.min(bounding.height - 110, finalY));

    // Update node coordinate state details
    onCanvasStateChange({
      ...canvasState,
      nodes: canvasState.nodes.map(n => n.id === draggedNodeId ? { ...n, x: finalX, y: finalY } : n)
    });
  };

  const handleCanvasMouseUp = () => {
    setDraggedNodeId(null);
  };

  // Node and Connection modifiers
  const handleConnectorMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setLinkingNodeId(nodeId);
  };

  const handleNodeTargetMouseUp = (e: React.MouseEvent, targetNodeId: string) => {
    if (linkingNodeId && linkingNodeId !== targetNodeId) {
      // Check if connection already exists
      const alreadyExists = canvasState.connections.some(
        c => (c.fromNodeId === linkingNodeId && c.toNodeId === targetNodeId) ||
             (c.fromNodeId === targetNodeId && c.toNodeId === linkingNodeId)
      );

      if (!alreadyExists) {
        const newConnection: CanvasConnection = {
          id: `conn-${Date.now()}`,
          fromNodeId: linkingNodeId,
          toNodeId: targetNodeId
        };
        onCanvasStateChange({
          ...canvasState,
          connections: [...canvasState.connections, newConnection]
        });
      }
    }
    setLinkingNodeId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Left-click outside context panel hides context panel
    if (!(e.target as HTMLElement).closest(".context-menu-panel")) {
      setContextMenuPos(null);
    }
    if (linkingNodeId) {
      setLinkingNodeId(null);
    }
  };

  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const bounding = canvasRef.current?.getBoundingClientRect();
    if (bounding) {
      const clickX = e.clientX - bounding.left;
      const clickY = e.clientY - bounding.top;
      
      setContextMenuPos({
        x: Math.min(clickX, bounding.width - 240),
        y: Math.min(clickY, bounding.height - 300)
      });
    }
  };

  const addAgentNode = (agentId: string) => {
    const defaultPos = contextMenuPos || { x: 200, y: 150 };
    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      agentId,
      x: defaultPos.x,
      y: defaultPos.y
    };

    onCanvasStateChange({
      ...canvasState,
      nodes: [...canvasState.nodes, newNode]
    });

    setContextMenuPos(null);
    setSearchQuery("");
  };

  const deleteNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCanvasStateChange({
      nodes: canvasState.nodes.filter(n => n.id !== nodeId),
      connections: canvasState.connections.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
    });
  };

  const deleteConnection = (connId: string) => {
    onCanvasStateChange({
      ...canvasState,
      connections: canvasState.connections.filter(c => c.id !== connId)
    });
  };

  const clearWorkspace = () => {
    if (confirm("Are you sure you want to remove all nodes from the current workspace canvas?")) {
      onCanvasStateChange({ nodes: [], connections: [] });
    }
  };

  // Rendering dynamic icons representing current placed nodes
  const renderIcon = (iconName: string) => {
    const IconC = (Icons as any)[iconName];
    if (IconC) return <IconC className="h-4 w-4 shrink-0" />;
    return <Icons.Bot className="h-4 w-4 shrink-0" />;
  };

  const filteredCatalog = searchQuery === ""
    ? agents
    : agents.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col min-w-0" onClick={handleCanvasClick}>
      {/* Workspace Sub Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white">
              {project.name} Workspace
            </h1>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-mono">
              {project.settings.brand}
            </span>
          </div>
          <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 truncate max-w-lg">
            Target Audience: <span className="font-semibold text-gray-700 dark:text-gray-300">{project.settings.targetAudience}</span> | Tone: <span className="font-semibold text-gray-700 dark:text-gray-300">{project.settings.tone}</span>
          </p>
        </div>

        {/* Workspace Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setContextMenuPos({ x: 100, y: 100 })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 active:scale-95"
            title="Right click canvas cell or press here to place marketing nodes"
          >
            <Plus className="h-4 w-4" />
            Add AI Agent Node
          </button>

          <button
            onClick={async () => {
              await onSaveCanvas();
              setSavingNote("Campaign changes saved persistently to visual server.");
              setTimeout(() => setSavingNote(null), 3000);
            }}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5 text-indigo-500" />
            )}
            Save Layout
          </button>

          <button
            onClick={clearWorkspace}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-950 dark:bg-gray-800 dark:text-rose-400 dark:hover:bg-rose-950/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Reset Canvas
          </button>
        </div>
      </div>

      {savingNote && (
        <div className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 px-6 py-2 text-[11px] font-semibold border-b border-indigo-100 dark:border-indigo-900/40 text-center flex items-center justify-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
          {savingNote}
        </div>
      )}

      {/* Main stage canvas interface with instructions */}
      <div className="flex-1 relative overflow-hidden bg-gray-50/50 dark:bg-gray-900/20 min-h-[460px] flex flex-col justify-end">
        {/* Help notification */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none max-w-sm rounded-xl bg-gray-900/90 p-3 shadow-lg border border-gray-800 backdrop-blur-md">
          <div className="flex items-start gap-2.5 text-xs text-gray-300">
            <HelpCircle className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
            <div className="text-left space-y-1">
              <p className="font-bold text-white">Visual Campaign Board Instructions</p>
              <ul className="list-disc pl-3 space-y-1 text-gray-400 text-[10px]">
                <li>Right-click anywhere to summon AI nodes.</li>
                <li>Drag nodes to position. Click to set forms and run assets.</li>
                <li>Hold <span className="bg-gray-800 px-1 py-0.5 rounded font-mono font-bold text-white">Connect handle</span> from border and connect block to chain.</li>
                <li>Click visual line connection intersection tags anytime to delete link.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Empty placeholder guide */}
        {canvasState.nodes.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30 dark:bg-gray-950/20 pointer-events-none">
            <div className="rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950/30 mb-4 animate-bounce">
              <Sparkles className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Workspace Canvas is Empty
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed font-sans">
              Spawn digital copy and strategy agents visually. Right-click on the board or tap &ldquo;Add AI Agent Node&rdquo; above.
            </p>
          </div>
        )}

        {/* INTERACTIVE DRAG-STAGE FIELD */}
        <div
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onContextMenu={handleCanvasContextMenu}
          className="w-full h-full relative cursor-crosshair overflow-hidden canvas-grid dark:canvas-grid"
          style={{ minHeight: "500px" }}
        >
          {/* CONNECTIONS SVG LAYER - DRAWS THE WORKFLOW CONNECTIONS */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="rgb(99 102 241)" />
              </marker>
            </defs>

            {canvasState.connections.map((c) => {
              const fromN = canvasState.nodes.find(n => n.id === c.fromNodeId);
              const toN = canvasState.nodes.find(n => n.id === c.toNodeId);
              if (!fromN || !toN) return null;

              // Node dimensions are 200px wide, and node starts at x,y
              const fromX = fromN.x + 200; // source handle center-right
              const fromY = fromN.y + 40;  // approximate center of node card top area
              const toX = toN.x;          // target handle center-left
              const toY = toN.y + 40;

              // Quadratic Bezier curves for beautiful fluid pipelines
              const midX = (fromX + toX) / 2;
              const pathD = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;

              return (
                <g key={c.id}>
                  {/* Outer glow aura shadow line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.08)"
                    strokeWidth="8"
                  />
                  {/* Main pipeline link wire */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgb(99 102 241)"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    className="animate-[dash_20s_linear_infinite]"
                    markerEnd="url(#arrow)"
                  />
                  {/* Clickable delete node link trigger */}
                  <circle
                    cx={midX}
                    cy={(fromY + toY) / 2}
                    r="8.5"
                    fill="rgb(239 68 68)"
                    className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity pointer-events-auto"
                    title="Click pipeline marker to delete link"
                    onClick={() => deleteConnection(c.id)}
                  />
                  {/* Inner small cross */}
                  <line
                    x1={midX - 3}
                    y1={((fromY + toY) / 2) - 3}
                    x2={midX + 3}
                    y2={((fromY + toY) / 2) + 3}
                    stroke="white"
                    strokeWidth="1.5"
                    className="pointer-events-none"
                    style={{ opacity: 0.8 }}
                  />
                  <line
                    x1={midX + 3}
                    y1={((fromY + toY) / 2) - 3}
                    x2={midX - 3}
                    y2={((fromY + toY) / 2) + 3}
                    stroke="white"
                    strokeWidth="1.5"
                    className="pointer-events-none"
                    style={{ opacity: 0.8 }}
                  />
                </g>
              );
            })}
          </svg>

          {/* DRAGGABLE NODE CARDS OVERLAY */}
          {canvasState.nodes.map((n) => {
            const agentDef = agents.find(a => a._id === n.agentId);
            if (!agentDef) return null;

            const isCurrentLinkingSource = linkingNodeId === n.id;

            return (
              <div
                id={`canvas-node-${n.id}`}
                key={n.id}
                onMouseDown={(e) => handleNodeMouseDown(e, n.id)}
                onMouseUp={(e) => handleNodeTargetMouseUp(e, n.id)}
                className={`absolute w-[204px] select-none transition-all bento-card p-3.5 ${
                  isCurrentLinkingSource
                    ? "!border-amber-500 ring-2 ring-amber-500/20"
                    : "border-gray-200/90 dark:!border-zinc-800/80 hover:!border-indigo-500/80"
                }`}
                style={{ left: `${n.x}px`, top: `${n.y}px`, cursor: "grab" }}
              >
                {/* Visual Connector Targets */}
                {/* Left/target receiver marker */}
                <div 
                  className="absolute -left-1.5 top-10 h-3 w-3 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-950" 
                  title="Droppable visual connection receiver"
                />

                {/* Node Header info */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 truncate">
                    {renderIcon(agentDef.icon)}
                    <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-1 py-0.5 rounded">
                      {agentDef.category}
                    </span>
                  </div>
                  <button
                    onClick={(e) => deleteNode(n.id, e)}
                    className="delete-btn rounded p-0.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    title="Delete model node"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="text-left space-y-2">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {agentDef.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-sans truncate">
                      {agentDef.description}
                    </p>
                  </div>

                  {/* Trigger configure panel */}
                  <button
                    onClick={() => onAgentClick(agentDef._id, n.id)}
                    className="w-full rounded-lg bg-gray-50 hover:bg-indigo-50 dark:bg-gray-900/60 dark:hover:bg-indigo-950/30 py-1.5 px-2 text-[10px] font-bold text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors flex items-center justify-between pointer-events-auto"
                  >
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3 text-emerald-500" />
                      Configure & Run
                    </span>
                    <Icons.Settings className="h-3 w-3 opacity-60" />
                  </button>
                </div>

                {/* Right/Source connector wire handler */}
                <div
                  onMouseDown={(e) => handleConnectorMouseDown(e, n.id)}
                  className="connector-handle absolute -right-1.5 top-10 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-950 cursor-crosshair hover:scale-130 transition-transform active:bg-amber-500 flex items-center justify-center text-white"
                  title="Hold and drag to connect steps"
                  style={{ zIndex: 10 }}
                >
                  <Plus className="h-2 w-2 stroke-[3px]" />
                </div>
              </div>
            );
          })}

          {/* RIGHT-CLICK / POPUP CONTEXT AGENCY LIST MENU */}
          {contextMenuPos && (
            <div
              className="context-menu-panel absolute z-30 w-60 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl dark:border-gray-800 dark:bg-gray-950 flex flex-col space-y-2.5"
              style={{ left: `${contextMenuPos.x}px`, top: `${contextMenuPos.y}px` }}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-150 dark:border-gray-800">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                  Deploy AI Agent Here
                </span>
                <button
                  onClick={() => setContextMenuPos(null)}
                  className="rounded p-0.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Quick Filter Search */}
              <input
                type="text"
                placeholder="Search agents / tag categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-250 bg-gray-50/50 px-2.5 py-1 text-xs text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                autoFocus
              />

              {/* Filter List */}
              <div className="max-h-56 overflow-y-auto space-y-1">
                {filteredCatalog.length === 0 ? (
                  <p className="text-[10px] text-gray-400 text-center py-4 font-sans">No matching agent type</p>
                ) : (
                  filteredCatalog.map((agent) => (
                    <button
                      id={`context-agent-${agent._id}`}
                      key={agent._id}
                      onClick={() => addAgentNode(agent._id)}
                      className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors"
                    >
                      {renderIcon(agent.icon)}
                      <div className="truncate text-left leading-tight">
                        <p className="font-semibold text-[11px]">{agent.name}</p>
                        <p className="text-[9px] text-gray-400 truncate w-40">{agent.description}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
