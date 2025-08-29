import React from 'react';

export default function FormRow({ className = '', children }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  );
}