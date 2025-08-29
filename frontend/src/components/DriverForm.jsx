import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormRow from './FormRow';
import InlineField from './InlineField';

export default function DriverForm({ refresh, editing, setEditing }) {
  const [driver_code, setDriverCode] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [driver_type, setDriverType] = useState('');
  const [status, setStatus] = useState('active'); // default for consistency
  const [start_date, setStartDate] = useState(''); // YYYY-MM-DD
  const [truck_id, setTruckId] = useState('');     // UI string; coerce on submit
  const [trucks, setTrucks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get('/api/trucks');
        if (!cancelled) setTrucks(res.data ?? []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message ?? err.message ?? 'Failed to load trucks');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (editing) {
      setDriverCode(editing.driver_code ?? '');
      setFirstName(editing.first_name ?? '');
      setLastName(editing.last_name ?? '');
      setDriverType(editing.driver_type ?? '');
      setStatus(editing.status ?? 'active');
      setTruckId(
        editing.truck_id === null || editing.truck_id === undefined ? '' : String(editing.truck_id)
      );
      setStartDate(editing.start_date ?? '');
    } else {
      setDriverCode('');
      setFirstName('');
      setLastName('');
      setDriverType('');
      setStatus('active');
      setTruckId('');
      setStartDate('');
      setError(null);
    }
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const truckIdForApi = truck_id === '' ? null : Number(truck_id);
    const payload = {
      driver_code: driver_code.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      driver_type: driver_type.trim(),
      status: status.trim(),
      truck_id: truckIdForApi,
      ...(start_date ? { start_date } : {}),
    };

    try {
      if (editing?.driver_id) {
        await axios.put(`/api/drivers/${editing.driver_id}`, payload);
      } else {
        await axios.post('/api/drivers', payload);
      }
      await refresh?.();
      setEditing(null);
    } catch (err) {
      setError(err?.response?.data?.message ?? err.message ?? 'Failed to save driver');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "block w-full h-8 px-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const buttonPrimary = "bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 disabled:opacity-50";
  const buttonSecondary = "bg-gray-200 text-gray-900 px-3 py-2 rounded hover:bg-gray-300 disabled:opacity-50";

  return (
    <>
      <div className="h-24 bg-red-500 text-white p-4">Tailwind is working</div>
      <form onSubmit={submit} className="bg-white shadow-md rounded-lg p-6 mb-4">
        {error && (
          <div className="mb-3 rounded bg-red-600 text-white px-3 py-2">
            {error}
          </div>
        )}

        <FormRow>
          <InlineField label="Driver Code" htmlFor="driver_code" required className="sm:col-span-2">
            <input id="driver_code" value={driver_code} onChange={(e) => setDriverCode(e.target.value)}
                   placeholder="Code" required className={inputClass} />
          </InlineField>

          <InlineField label="First Name" htmlFor="first_name" required className="sm:col-span-2">
            <input id="first_name" value={first_name} onChange={(e) => setFirstName(e.target.value)}
                   placeholder="First Name" required className={inputClass} />
          </InlineField>

          <InlineField label="Last Name" htmlFor="last_name" required className="sm:col-span-2">
            <input id="last_name" value={last_name} onChange={(e) => setLastName(e.target.value)}
                   placeholder="Last Name" required className={inputClass} />
          </InlineField>

          <InlineField label="Start Date" htmlFor="start_date" className="sm:col-span-2">
            <input id="start_date" type="date" name="start_date" value={start_date}
                   onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
          </InlineField>

          <InlineField label="Driver Type" htmlFor="driver_type" required className="sm:col-span-2">
            <input id="driver_type" value={driver_type} onChange={(e) => setDriverType(e.target.value)}
                   placeholder="Type" required className={inputClass} />
          </InlineField>

          <InlineField label="Truck Unassigned" htmlFor="truck_id">
            <select id="truck_id" value={truck_id} onChange={(e) => setTruckId(e.target.value)}
                    className={inputClass}>
              <option value="">-- Unassigned --</option>
              {trucks.map((t) => (
                <option key={t.truck_id} value={t.truck_id}>
                  {t.unit_number ?? `Truck #${t.truck_id}`}
                </option>
              ))}
            </select>
          </InlineField>

          <InlineField label="Status" htmlFor="status" required className="sm:col-span-2">
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}
                    className={inputClass}>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </InlineField>
        </FormRow>

        <div className="flex justify-end items-center gap-2">
          <button type="submit" disabled={saving} className={buttonPrimary}>
            {saving ? (editing ? 'Updating…' : 'Adding…') : (editing ? 'Update' : 'Add')} Driver
          </button>
          {editing && (
            <button type="button" onClick={() => setEditing(null)} disabled={saving} className={buttonSecondary}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}
