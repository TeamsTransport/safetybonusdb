import React from 'react';
import './index.css';

export default function App() {
  return (
    <div>
      {/* Test with very basic Tailwind classes */}
      <div className="bg-red-500 p-8 text-white text-2xl font-bold">
        This should have a red background
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Test Button
      </button>
    </div>
  );
}
