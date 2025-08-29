import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import DriverForm from './DriverForm';

export default function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/api/drivers');
      setDrivers(Array.isArray(data) ? data : []);
      // If we were editing a driver, refresh the editing object from the new list
      if (editing?.driver_id) {
        const updated = data.find(d => d.driver_id === editing.driver_id);
        // If it no longer exists (e.g., got deleted elsewhere), clear editing
        setEditing(updated ?? null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-line react-hooks/exhaustive-deps */ }, []);

  const confirmAndDelete = async (id) => {
    const driver = drivers.find(d => d.driver_id === id);
    const label = driver ? `${driver.first_name} ${driver.last_name} (#${driver.driver_code})` : `#${id}`;
    if (!window.confirm(`Delete driver ${label}? This cannot be undone.`)) return;

    setDeletingId(id);
    setError(null);

    // Optimistic UI: remove locally, then fall back to reload on failure
    const prev = drivers;
    setDrivers(prev.filter(d => d.driver_id !== id));
    try {
      await axios.delete(`/api/drivers/${id}`);
      // If the deleted driver was being edited, clear edit state
      if (editing?.driver_id === id) setEditing(null);
    } catch (err) {
      setDrivers(prev); // rollback
      setError(err?.response?.data?.message || err.message || 'Failed to delete driver');
    } finally {
      setDeletingId(null);
    }
  };

  // Format YYYY-MM-DD safely without timezone surprises
  const formatYmd = (s) => {
    if (!s) return '—';
    // Expecting 'YYYY-MM-DD'
    const parts = String(s).split('-');
    if (parts.length !== 3) return s; // If API returns ISO string, let it show raw (or improve here)
    const [y, m, d] = parts;
    return `${m}/${d}/${y}`; // MM/DD/YYYY (change to taste)
  };

  // (Optional) sort by last name then first name
  const sortedDrivers = useMemo(() => {
    return [...drivers].sort((a, b) => {
      const ln = (a.last_name || '').localeCompare(b.last_name || '');
      if (ln !== 0) return ln;
      return (a.first_name || '').localeCompare(b.first_name || '');
    });
  }, [drivers]);

  return (
    <section>
      <h2>Drivers</h2>

      <DriverForm refresh={load} editing={editing} setEditing={setEditing} />

      {error && (
        <div style={{ color: '#842029', background: '#f8d7da', border: '1px solid #f5c2c7', padding: '8px', borderRadius: 4, marginBottom: 8 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading drivers…</div>
      ) : (
        <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>Unit</th>
              <th>Type</th>
              <th>Status</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedDrivers.map(d => {
              const isEditing = editing?.driver_id === d.driver_id;
              return (
                <tr key={d.driver_id} style={isEditing ? { background: '#fff8e1' } : undefined}>
                  <td>{d.driver_id}</td>
                  <td>{d.driver_code}</td>
                  <td>{d.first_name} {d.last_name}</td>
                  <td>{formatYmd(d.start_date)}</td>
                  <td>{d.unit_number ?? 'Unassigned'}</td>
                  <td>{d.driver_type}</td>
                  <td>{d.status}</td>
                  <td>
                    <button onClick={() => setEditing(d)} disabled={deletingId === d.driver_id}>
                      Edit
                    </button>{' '}
                    <button onClick={() => confirmAndDelete(d.driver_id)} disabled={deletingId === d.driver_id}>
                      {deletingId === d.driver_id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {sortedDrivers.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#555' }}>
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
