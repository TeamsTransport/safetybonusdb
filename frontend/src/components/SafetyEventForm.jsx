import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormRow from './FormRow';
import InlineField from './InlineField';

export default function SafetyEventForm({ refresh, editing, setEditing }) {
  const [form, setForm] = useState({
    driver_id: '',
    event_date: '',
    category_id: '',
    notes: '',
    bonus_score: '0',
    p_i_score: '0',
    bonus_period: false,
  });

  const [drivers, setDrivers] = useState([]);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const loadRefs = async () => {
      const [d, c] = await Promise.all([
        axios.get('/api/drivers'),
        axios.get('/api/safetyCategories'),
      ]);
      setDrivers(Array.isArray(d.data) ? d.data : []);
      setCats(Array.isArray(c.data) ? c.data : []);
    };
    loadRefs();
  }, []);

  useEffect(() => {
    if (editing) {
      setForm({
        driver_id: editing.driver_id,
        event_date: editing.event_date?.slice(0, 10) ?? '',
        category_id: editing.category_id ?? '',
        notes: editing.notes ?? '',
        bonus_score: editing.bonus_score ?? '0',
        p_i_score: editing.p_i_score ?? '0',
        bonus_period: !!editing.bonus_period,
      });
    }
  }, [editing]);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editing?.event_id) {
      await axios.put(`/api/safetyEvents/${editing.event_id}`, form);
      setEditing(null);
    } else {
      await axios.post('/api/safetyEvents', form);
    }
    setForm({
      driver_id: '',
      event_date: '',
      category_id: '',
      notes: '',
      bonus_score: '0',
      p_i_score: '0',
      bonus_period: false,
    });
    refresh?.();
  };

  const inputClass = "h-8 px-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const textAreaClass = "px-2 py-1 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const buttonPrimary = "bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 disabled:opacity-50";
  const buttonSecondary = "bg-gray-200 text-gray-900 px-3 py-2 rounded hover:bg-gray-300 disabled:opacity-50";

  return (
    <form onSubmit={onSubmit} className="mb-4">
      <FormRow>
        <InlineField label="Driver" htmlFor="driver_id" required className="min-w-[260px]">
          <select id="driver_id" name="driver_id" value={form.driver_id} onChange={onChange} className={inputClass} required>
            <option value="">-- Select driver --</option>
            {drivers.map((d) => (
              <option key={d.driver_id} value={d.driver_id}>
                {d.driver_code} – {d.first_name} {d.last_name}
              </option>
            ))}
          </select>
        </InlineField>

        <InlineField label="Category" htmlFor="category_id" required className="min-w-[260px]">
          <select id="category_id" name="category_id" value={form.category_id} onChange={onChange} className={inputClass} required>
            <option value="">-- Select category --</option>
            {cats.map((c) => (
              <option key={c.category_id ?? c.code} value={c.category_id ?? c.code}>
                {c.code} – {c.description}
              </option>
            ))}
          </select>
        </InlineField>

        <InlineField label="Event Date" htmlFor="event_date" required>
          <input id="event_date" name="event_date" type="date" value={form.event_date} onChange={onChange} className={inputClass} required />
        </InlineField>

        <InlineField label="Bonus Score" htmlFor="bonus_score">
          <input id="bonus_score" name="bonus_score" type="number" step="1" value={form.bonus_score} onChange={onChange} className={inputClass} />
        </InlineField>

        <InlineField label="P/I Score" htmlFor="p_i_score">
          <input id="p_i_score" name="p_i_score" type="number" step="1" value={form.p_i_score} onChange={onChange} className={inputClass} />
        </InlineField>

        <InlineField label="Bonus Period" htmlFor="bonus_period">
          <input id="bonus_period" name="bonus_period" type="checkbox" checked={form.bonus_period}
                 onChange={onChange} className="h-4 w-4 accent-indigo-600" />
        </InlineField>

        <div className="ml-auto flex items-center gap-2">
          <button type="submit" className={buttonPrimary}>
            {editing ? 'Update' : 'Add'} Event
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  driver_id: '',
                  event_date: '',
                  category_id: '',
                  notes: '',
                  bonus_score: '0',
                  p_i_score: '0',
                  bonus_period: false,
                });
              }}
              className={buttonSecondary}
            >
              Cancel
            </button>
          )}
        </div>
      </FormRow>

      {/* Put notes on its own wrapped row so it can grow */}
      <FormRow>
        <InlineField label="Notes" htmlFor="notes" className="w-full">
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={onChange}
            rows={3}
            className={`${textAreaClass} w-full`}
            placeholder="Optional notes"
          />
        </InlineField>
      </FormRow>
    </form>
  );
}
