import React, { useState, useEffect } from "react";
import { 
  Clipboard, Download, Trash2, Edit2, Check, RefreshCw, Sparkles, FileText, Send, Eye, Save 
} from "lucide-react";
import { Asset, Agent } from "../../types";

interface OutputPreviewProps {
  asset: Asset | null;
  agent: Agent | null;
  onClose: () => void;
  onUpdateAssetContent: (assetId: string, updatedText: string) => Promise<void>;
  onDeleteAsset: (assetId: string) => Promise<void>;
  onRegenerate: () => void;
}

export default function OutputPreview({
  asset,
  agent,
  onClose,
  onUpdateAssetContent,
  onDeleteAsset,
  onRegenerate
}: OutputPreviewProps) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [copyWorked, setCopyWorked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (asset) {
      setEditedText(asset.content);
      setIsEditing(false);
    }
  }, [asset]);

  if (!asset) return null;

  // Clipboard copy action
  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    setCopyWorked(true);
    setTimeout(() => setCopyWorked(false), 2000);
  };

  // Download raw document trigger
  const handleDownload = () => {
    const blob = new Blob([editedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `campaign-asset-${asset._id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdateAssetContent(asset._id, editedText);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
    setIsUpdating(false);
  };

  // Safe lightweight regex markdown parser
  const renderSimpleMarkdown = (text: string) => {
    if (!text) return "";
    
    // Split into structural lines
    const lines = text.split("\n");
    let inList = false;
    let listHTML = "";
    
    const parsedLines = lines.map((line, index) => {
      let trimmed = line.trim();
      
      // Handle Headers H3, H4, H1 etc
      if (trimmed.startsWith("####")) {
        return `<h5 class="text-xs font-black text-indigo-500 uppercase tracking-widest mt-4 mb-2 font-display">${trimmed.slice(4).trim()}</h5>`;
      }
      if (trimmed.startsWith("###")) {
        return `<h4 class="text-sm font-black text-gray-950 dark:text-gray-100 mt-6 mb-3 font-display border-b border-gray-100 pb-1.5">${trimmed.slice(3).trim()}</h4>`;
      }
      if (trimmed.startsWith("##")) {
        return `<h3 class="text-base font-black text-gray-900 dark:text-white mt-8 mb-4 font-display font-black">${trimmed.slice(2).trim()}</h3>`;
      }
      if (trimmed.startsWith("#")) {
        return `<h2 class="text-lg font-black text-indigo-700 dark:text-indigo-400 mt-8 mb-4 font-display">${trimmed.slice(1).trim()}</h2>`;
      }

      // Handle Blockquotes
      if (trimmed.startsWith(">")) {
        return `<blockquote class="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-r-lg italic text-xs leading-relaxed text-gray-700 dark:text-gray-300">${trimmed.slice(1).trim()}</blockquote>`;
      }

      // Handle Horizontal Rule
      if (trimmed === "---") {
        return `<hr class="my-6 border-gray-150 dark:border-gray-800" />`;
      }

      // Handle Images
      const imgMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        return `<div class="my-5 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-md">
          <img src="${imgMatch[2]}" alt="${imgMatch[1]}" class="w-full h-auto object-cover max-h-[300px]" referrerPolicy="no-referrer" />
        </div>`;
      }

      // Handle lists
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const itemText = trimmed.slice(2).trim();
        return `<li class="ml-4 list-disc pl-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">${itemText}</li>`;
      }

      // Handle standard Bold formats inline: **word** to <strong class="font-bold">word</strong>
      let lineHTML = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] font-mono text-indigo-500">$1</code>');

      if (lineHTML === "") {
        return `<div class="h-2"></div>`;
      }

      return `<p class="text-xs leading-relaxed text-gray-600 dark:text-gray-300 font-sans my-2.5">${lineHTML}</p>`;
    });

    return parsedLines.join("");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950/70 p-5 flex flex-col justify-between space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-150 dark:border-gray-800">
        <div className="space-y-0.5 text-left">
          <span className="text-[9px] font-bold tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
            Campaign Asset output
          </span>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-sm">
            {asset.title}
          </h3>
        </div>

        {/* Action Panel items */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            title="Copy content copy to Clipboard"
          >
            {copyWorked ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500 text-[10px]">Copied!</span>
              </>
            ) : (
              <>
                <Clipboard className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            title="Download document as rich text file"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-1 rounded-lg border p-1.5 text-[11px] font-bold transition-all ${
              isEditing
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>{isEditing ? "Viewing Output" : "Surgical Edit"}</span>
          </button>

          <button
            onClick={onRegenerate}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-indigo-600 px-2 py-1.5 text-[11px] font-bold text-white shadow shadow-indigo-600/15 hover:bg-indigo-500"
            title="Open modal details to regenerate options"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Actual content pane (editing or reading) */}
      <div className="flex-1 min-h-[300px] max-h-[500px] overflow-y-auto">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full h-96 rounded-xl border border-gray-200 bg-white p-3.5 font-mono text-xs text-gray-800 shadow-inner focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Direct draft copy adjustments..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500"
              >
                {isUpdating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save Changes persistently
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="text-left select-text"
            dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(editedText) }}
          />
        )}
      </div>

      {/* Footer tags and guidelines */}
      <div className="pt-3 border-t border-gray-150 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5 text-gray-400" />
          Tags: {asset.tags.map(t => `#${t}`).join(" ")}
        </span>
        <span>Generated {new Date(asset.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
