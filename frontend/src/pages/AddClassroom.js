import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { addClassroom } from '../utils/api';
import { useClassrooms } from '../context/ClassroomContext';
import { COLORS } from '../utils/constants';

const INITIAL_FORM = { roomId: '', capacity: '', floorNo: '', nearWashroom: false };

const validate = (form) => {
  const errors = {};
  if (!form.roomId.trim()) errors.roomId = 'Room ID is required';
  else if (form.roomId.trim().length > 20) errors.roomId = 'Room ID max 20 characters';
  if (form.capacity === '') errors.capacity = 'Capacity is required';
  else if (Number(form.capacity) < 1) errors.capacity = 'Capacity must be at least 1';
  if (form.floorNo === '') errors.floorNo = 'Floor number is required';
  else if (Number(form.floorNo) < 0) errors.floorNo = 'Floor must be 0 or greater';
  return errors;
};

const AddClassroom = () => {
  const [form, setForm]         = useState(INITIAL_FORM);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { fetchClassrooms }     = useClassrooms();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await addClassroom({
        roomId: form.roomId.trim(),
        capacity: Number(form.capacity),
        floorNo: Number(form.floorNo),
        nearWashroom: form.nearWashroom,
      });
      toast.success(`Classroom "${form.roomId.trim()}" added successfully!`);
      setForm(INITIAL_FORM);
      fetchClassrooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add classroom');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={S.page}>

      {/* Page Header */}
      <div style={S.header}>
        <h1 style={S.title}>➕ Add Classroom</h1>
        <p style={S.subtitle}>Fill in the classroom details below.</p>
      </div>

      {/* Form Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={S.cardIcon}>🏫</span>
          <div>
            <h2 style={S.cardTitle}>Classroom Registration Form</h2>
            <p style={S.cardSub}>All fields are required</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={S.grid}>

            {/* Room ID */}
            <Field label="Room ID" required error={errors.roomId}>
              <input
                style={{ ...S.input, ...(errors.roomId ? S.inputErr : {}) }}
                name="roomId"
                placeholder="e.g., A101, Lab-03, CS-Hall"
                value={form.roomId}
                onChange={handleChange}
                maxLength={20}
              />
            </Field>

            {/* Capacity */}
            <Field label="Capacity (Seat Count)" required error={errors.capacity}>
              <input
                style={{ ...S.input, ...(errors.capacity ? S.inputErr : {}) }}
                name="capacity"
                type="number"
                placeholder="e.g., 40"
                value={form.capacity}
                onChange={handleChange}
                min="1"
              />
            </Field>

            {/* Floor No */}
            <Field label="Floor Number" required error={errors.floorNo} hint="0 = Ground Floor, 1 = First Floor, etc.">
              <input
                style={{ ...S.input, ...(errors.floorNo ? S.inputErr : {}) }}
                name="floorNo"
                type="number"
                placeholder="e.g., 0"
                value={form.floorNo}
                onChange={handleChange}
                min="0"
              />
            </Field>

            {/* Near Washroom */}
            <Field label="Near Washroom" required hint="Does this room have washroom nearby?">
              <label style={S.toggleWrap}>
                <input
                  type="checkbox"
                  name="nearWashroom"
                  checked={form.nearWashroom}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div style={{ ...S.track, background: form.nearWashroom ? COLORS.green : '#334155' }}>
                  <div style={{ ...S.thumb, transform: form.nearWashroom ? 'translateX(28px)' : 'translateX(0px)' }} />
                </div>
                <span style={{ color: form.nearWashroom ? COLORS.green : COLORS.textFaint, fontWeight: 600 }}>
                  {form.nearWashroom ? '✅ Yes — Near Washroom' : '❌ No — Not Near Washroom'}
                </span>
              </label>
            </Field>

          </div>

          <div style={S.actions}>
            <button
              type="button"
              style={S.resetBtn}
              onClick={() => { setForm(INITIAL_FORM); setErrors({}); }}
            >
              🔄 Reset
            </button>
            <button type="submit" style={S.submitBtn} disabled={submitting}>
              {submitting ? '⏳ Adding...' : '➕ Add Classroom'}
            </button>
          </div>
        </form>
      </div>


    </div>
  );
};

// ── Sub-component: Field wrapper ──
const Field = ({ label, required, error, hint, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ color: COLORS.textFaint, fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
      {label} {required && <span style={{ color: COLORS.primary }}>*</span>}
    </label>
    {children}
    {hint && <span style={{ color: COLORS.textFaint, fontSize: '0.75rem' }}>{hint}</span>}
    {error && <span style={{ color: COLORS.primary, fontSize: '0.78rem', fontWeight: 500 }}>⚠ {error}</span>}
  </div>
);

const S = {
  page: { padding: '2rem', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' },
  header: {},
  title: { color: COLORS.textPrimary, fontSize: '1.8rem', margin: '0 0 0.4rem' },
  subtitle: { color: COLORS.textMuted, fontSize: '0.95rem', margin: 0 },
  card: {
    background: COLORS.surface,
    borderRadius: '16px',
    padding: '2rem',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  },
  cardHeader: { display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: `1px solid ${COLORS.border}` },
  cardIcon: { fontSize: '2.5rem' },
  cardTitle: { color: COLORS.textPrimary, margin: '0 0 4px', fontSize: '1.1rem' },
  cardSub: { color: COLORS.textFaint, fontSize: '0.82rem', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' },
  input: {
    background: COLORS.secondary,
    border: `1px solid #1e3a5f`,
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: COLORS.textPrimary,
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  inputErr: { borderColor: COLORS.primary },
  toggleWrap: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', paddingTop: '8px' },
  track: {
    width: '56px',
    height: '28px',
    borderRadius: '14px',
    position: 'relative',
    transition: 'background 0.3s',
    flexShrink: 0,
  },
  thumb: {
    position: 'absolute',
    top: '3px',
    left: '3px',
    width: '22px',
    height: '22px',
    background: '#fff',
    borderRadius: '50%',
    transition: 'transform 0.3s',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
  resetBtn: {
    background: 'transparent',
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textMuted,
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  submitBtn: {
    background: `linear-gradient(135deg, ${COLORS.primary}, #c0392b)`,
    border: 'none',
    color: '#fff',
    borderRadius: '8px',
    padding: '0.75rem 1.75rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 700,
    letterSpacing: '0.3px',
  },
};

export default AddClassroom;
