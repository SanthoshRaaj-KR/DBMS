import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox,
  title = "No data found",
  description = "There are no items to display at the moment.",
  actionLabel,
  onAction
}) {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}


