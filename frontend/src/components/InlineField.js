import React from 'react';

export default function InlineField({
  label,
  htmlFor,
  children,
  required = false,
  className = '',
  labelClassName = '',
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className={`font-medium text-gray-700 ${labelClassName}`}>
          {label}{required ? ' *' : ''}
        </label>
      )}
      {children}
    </div>
  );
}
