import React from 'react';

export default function PageHeader({ 
  title, 
  subtitle, 
  action,
  icon: Icon 
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-blue-50 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-gray-600 mt-2">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}


