// src/components/TestDaisy.jsx
export default function TestDaisy() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">DaisyUI + Tailwind CSS v4</h1>
      
      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-accent">Accent</button>
        <button className="btn btn-info">Info</button>
      </div>

      {/* Card */}
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Success!</h2>
          <p>DaisyUI is working with Tailwind CSS v4</p>
          <div className="card-actions justify-end">
            <button className="btn btn-success">Get Started</button>
          </div>
        </div>
      </div>

      {/* Theme toggle */}
      <div className="mt-6">
        <button className="btn btn-outline" onClick={() => document.documentElement.classList.toggle('dark')}>
          Toggle Dark Mode
        </button>
      </div>
    </div>
  )
}