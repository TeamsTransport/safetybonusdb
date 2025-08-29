import React from 'react';
import DriverList from './components/DriverList';
import TruckList from './components/TruckList';
import SafetyEventList from './components/SafetyEventList';

export default function App() {
  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h1>Safety Bonus Dashboard</h1>
      <DriverList />
      <hr/>
      <TruckList />
      <hr/>
      <SafetyEventList />
    </div>
  );
}
