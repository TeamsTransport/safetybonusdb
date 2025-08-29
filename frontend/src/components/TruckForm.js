import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormRow from './FormRow';
import InlineField from './InlineField';

export default function TruckForm({ refresh, editing, setEditing }) {
  const [form, setForm] = useState({ unit_number: '', status: 'active' });

  useEffect(() => {
    if (editing) {
      setForm({
        unit_number: editing.unit_number ?? '',
        status: editing.status ?? 'active',
      });
    } else {
      setForm({ unit_number: '', status: 'active' });
    }
  }, [editing]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editing?.truck_id) {
      await axios.put(`/api/trucks/${editing.truck_id}`, form);
      setEditing(null);
    } else {
      await axios.post('/api/trucks', form);
    }
    setForm({ unit_number: '', status: 'active' });
    await refresh?.();
  };

  const inputClass = "h-8 px-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const buttonPrimary = "bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 disabled:opacity-50";
  const buttonSecondary = "bg-gray-200 text-gray-900 px-3 py-2 rounded hover:bg-gray-300 disabled:opacity-50";

  return (
    <form onSubmit={onSubmit} className="mb-4">
      <FormRow>
        <InlineField label="Unit #" htmlFor="unit_number" required>
          <input
            id="unit_number"
            name="unit_number"
            value={form.unit_number}
            onChange={onChange}
            placeholder="e.g. 1234"
            required
            className={inputClass}
          />
        </InlineField>

        <InlineField label="Status" htmlFor="status" required>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={onChange}
            className={inputClass}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </InlineField>

        <div className="ml-auto flex items-center gap-2">
          <button type="submit" className={buttonPrimary}>
            {editing ? 'Update' : 'Add'} Truck
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ unit_number: '', status: 'active' });
              }}
              className={buttonSecondary}
            >
              Cancel
            </button>
          )}
        </div>
      </FormRow>
    </form>
  );
}
