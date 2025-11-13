import React from 'react';

export default function Card({ 
  title, 
  subtitle,
  children,
  headerAction,
  noPadding = false,
  className = ""
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
}


