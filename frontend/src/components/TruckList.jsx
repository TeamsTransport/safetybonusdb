import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TruckForm from './TruckForm';

export default function TruckList() {
  const [trucks, setTrucks] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const { data } = await axios.get('/api/trucks');
    setTrucks(data);
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    await axios.delete(`/api/trucks/${id}`);
    load();
  };

  return (
    <section>
      <h2>Trucks</h2>
      <TruckForm refresh={load} editing={editing} setEditing={setEditing} />
      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>ID</th><th>Unit #</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {trucks.map(t => (
            <tr key={t.truck_id}>
              <td>{t.truck_id}</td>
              <td>{t.unit_number}</td>
              <td>{t.status}</td>
              <td>
                <button onClick={()=>setEditing(t)}>Edit</button>{' '}
                <button onClick={()=>del(t.truck_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
