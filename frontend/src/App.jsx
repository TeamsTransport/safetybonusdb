import React from 'react';
import DriverList from './components/DriverList';
import TruckList from './components/TruckList';
import SafetyEventList from './components/SafetyEventList';
import TestDaisy from './components/TestDaisy'

export default function App() {
  return (
    <div className="p-5 max-w-screen-xl mx-auto">
      <h1>Safety Bonus Dashboard</h1>
      <TestDaisy />
      <hr/>
      <DriverList />
      <hr/>
      <TruckList />
      <hr/>
      <SafetyEventList />
    </div>
  );
}
