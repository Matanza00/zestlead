// components/common/Modal.tsx
import React from "react";

export default function Modal({
  open,
  onClose,
  children,
  title
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl relative p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title || "Modal"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
