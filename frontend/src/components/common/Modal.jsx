import React from "react";
import { X } from "lucide-react";

// centered overlay dialog — controlled by the parent via isOpen/onClose
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-card bg-surface p-6 shadow-card dark:bg-ink">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-medium">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-ink dark:hover:text-canvas">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
