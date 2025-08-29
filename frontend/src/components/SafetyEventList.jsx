import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SafetyEventForm from './SafetyEventForm';

export default function SafetyEventList() {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const { data } = await axios.get('/api/safetyEvents');
    setEvents(data);
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    await axios.delete(`/api/safetyEvents/${id}`);
    load();
  };

  return (
    <section>
      <h2>Safety Events</h2>
      <SafetyEventForm refresh={load} editing={editing} setEditing={setEditing} />
      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th><th>Date</th><th>Driver</th><th>Category</th>
            <th>Bonus</th><th>P/I</th><th>Bonus Period</th><th>Notes</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e.event_id}>
              <td>{e.event_id}</td>
              <td>{e.event_date}</td>
              <td>{e.driver_code} – {e.first_name} {e.last_name}</td>
              <td>{e.category_code} – {e.category_name}</td>
              <td>{e.bonus_score}</td>
              <td>{e.p_i_score}</td>
              <td>{e.bonus_period ? 'YES':'NO'}</td>
              <td>{e.notes}</td>
              <td>
                <button onClick={()=>setEditing(e)}>Edit</button>{' '}
                <button onClick={()=>del(e.event_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
