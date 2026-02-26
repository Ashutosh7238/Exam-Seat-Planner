import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { allocateExam } from '../utils/api';
import { COLORS } from '../utils/constants';

/* ──────────────────────────────────────────
   AllocateExam(totalStudents) — Page
────────────────────────────────────────── */

const AllocateExam = () => {
  const [students, setStudents]   = useState('');
  const [inputErr, setInputErr]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);   // null = no result yet

  const handleAllocate = async (e) => {
    e.preventDefault();
    const n = Number(students);
    if (!n || n < 1) { setInputErr('Please enter a valid number (≥ 1)'); return; }
    setInputErr('');
    setLoading(true);
    setResult(null);

    try {
      const res = await allocateExam(n);
      setResult(res.data);
      if (res.data.sufficient) {
        toast.success(`Allocated across ${res.data.totalRoomsUsed} room(s)!`);
      } else {
        toast.error('Not enough seats available!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Allocation failed. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setStudents(''); setInputErr(''); };

  return (
    <div style={S.page}>

      {/* Page Header */}
      <div style={S.header}>
        <h1 style={S.title}>🎯 Allocate Exam Seats</h1>
        <p style={S.subtitle}>
          Enter the total number of students to assign the{' '}
          <strong style={{ color: COLORS.textPrimary }}>minimum number of classrooms</strong>,
          preferring lower-floor rooms first.
        </p>
      </div>

      {/* ── Input Panel ── */}
      <div style={S.inputCard}>
        <h2 style={S.sectionLabel}>📥 Input</h2>
        <form onSubmit={handleAllocate} style={S.form}>
          <div style={S.inputGroup}>
            <label style={S.label}>
              Total Number of Students <span style={{ color: COLORS.primary }}>*</span>
            </label>
            <div style={S.inputRow}>
              <input
                style={{ ...S.input, ...(inputErr ? S.inputErr : {}) }}
                type="number"
                placeholder="Enter number of students (e.g., 150)"
                value={students}
                onChange={(e) => { setStudents(e.target.value); setInputErr(''); }}
                min="1"
              />
              <button type="submit" style={S.allocBtn} disabled={loading}>
                {loading ? '⏳ Allocating...' : '🚀 Allocate Seats'}
              </button>
            </div>
            {inputErr && <span style={S.err}>{inputErr}</span>}
          </div>
        </form>


      </div>

      {/* ── Output Display Panel ── */}
      {result !== null && (
        <div style={S.outputPanel}>
          <div style={S.outputHeader}>
            <h2 style={S.sectionLabel}>📤 Output Display Panel</h2>
            <button style={S.resetBtn} onClick={handleReset}>✕ Clear</button>
          </div>

          {/* ── INSUFFICIENT CASE ── */}
          {!result.sufficient && (
            <div style={S.insuffBox}>
              <div style={S.insuffIcon}>⚠️</div>
              <h2 style={S.insuffTitle}>Not enough seats available</h2>
              <div style={S.insuffGrid}>
                <InfoPill label="Students Needed" value={result.totalStudents} color={COLORS.amber} />
                <InfoPill label="Total Capacity"  value={result.totalCapacity}  color={COLORS.primary} />
                <InfoPill label="Shortfall"       value={result.shortfall}      color={COLORS.primary} />
              </div>
              <p style={S.insuffTip}>
                Add more classrooms or reduce the number of students.
              </p>
            </div>
          )}

          {/* ── SUCCESS CASE ── */}
          {result.sufficient && (
            <>
              {/* Summary cards */}
              <div style={S.summaryGrid}>
                <SummaryCard icon="👥" label="Total Students"  value={result.totalStudents}    color="#818cf8" />
                <SummaryCard icon="🏫" label="Rooms Used"      value={result.totalRoomsUsed}    color={COLORS.green} />
                <SummaryCard icon="📦" label="Total Available" value={result.totalRoomsAvailable} color={COLORS.blue} />
              </div>

              <div style={S.successMsg}>
                ✅ {result.message}
              </div>

              {/* Allocated Classrooms Table */}
              <h3 style={S.tableHeading}>📌 Allocated Classrooms List</h3>
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {['#', 'Room ID', 'Floor No', 'Capacity', 'Students Allocated', 'Near Washroom', 'Utilization'].map((h) => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.allocatedRooms.map((room, i) => (
                      <tr key={room.roomId} style={{ background: i % 2 === 0 ? COLORS.surface : COLORS.surfaceAlt }}>
                        <td style={S.td}>{i + 1}</td>
                        <td style={{ ...S.td, color: COLORS.blue, fontWeight: 700 }}>{room.roomId}</td>
                        <td style={S.td}>
                          <span style={S.floorPill}>Floor {room.floorNo}</span>
                        </td>
                        <td style={S.td}>{room.capacity}</td>
                        <td style={{ ...S.td, color: COLORS.green, fontWeight: 700 }}>
                          {room.studentsAllocated}
                        </td>
                        <td style={S.td}>
                          {room.nearWashroom
                            ? <span style={S.yesTag}>✅ Yes</span>
                            : <span style={S.noTag}>❌ No</span>
                          }
                        </td>
                        <td style={S.td}>
                          <ProgressBar pct={room.utilizationPercent} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Floor distribution info */}
              <FloorSummary rooms={result.allocatedRooms} />
            </>
          )}
        </div>
      )}

      {/* Empty state before allocation */}
      {result === null && !loading && (
        <div style={S.waiting}>
          <div style={S.waitingIcon}>🎓</div>
          <p style={S.waitingText}>
            Enter the number of students above and click <strong>Allocate Seats</strong> to see the output.
          </p>
        </div>
      )}

    </div>
  );
};

// ── Sub-components ──

const SummaryCard = ({ icon, label, value, color }) => (
  <div style={{ ...SC.card, borderTop: `3px solid ${color}` }}>
    <span style={SC.icon}>{icon}</span>
    <div style={{ ...SC.val, color }}>{value}</div>
    <div style={SC.lbl}>{label}</div>
  </div>
);
const SC = {
  card: { background: COLORS.secondary, borderRadius: '12px', padding: '1.25rem', textAlign: 'center' },
  icon: { fontSize: '1.5rem' },
  val:  { fontSize: '2rem', fontWeight: 800, margin: '4px 0' },
  lbl:  { color: COLORS.textMuted, fontSize: '0.8rem', fontWeight: 500 },
};

const InfoPill = ({ label, value, color }) => (
  <div style={{ textAlign: 'center', padding: '1rem', background: COLORS.secondary, borderRadius: '10px' }}>
    <div style={{ color, fontSize: '1.8rem', fontWeight: 800 }}>{value}</div>
    <div style={{ color: COLORS.textMuted, fontSize: '0.82rem', marginTop: '4px' }}>{label}</div>
  </div>
);

const ProgressBar = ({ pct }) => {
  const color = pct === 100 ? COLORS.primary : pct > 70 ? '#f59e0b' : COLORS.green;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, background: COLORS.secondary, borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '4px', transition: 'width 0.5s' }} />
      </div>
      <span style={{ color: COLORS.textFaint, fontSize: '0.75rem', minWidth: '35px' }}>{pct}%</span>
    </div>
  );
};

const FloorSummary = ({ rooms }) => {
  const byFloor = rooms.reduce((acc, r) => {
    const k = `Floor ${r.floorNo}`;
    if (!acc[k]) acc[k] = { rooms: 0, students: 0 };
    acc[k].rooms++;
    acc[k].students += r.studentsAllocated;
    return acc;
  }, {});

  return (
    <div style={FS.wrap}>
      <h4 style={FS.title}>🏢 Floor Distribution</h4>
      <div style={FS.grid}>
        {Object.entries(byFloor).map(([floor, data]) => (
          <div key={floor} style={FS.pill}>
            <strong style={{ color: COLORS.blue }}>{floor}</strong>
            <span style={{ color: COLORS.textMuted, fontSize: '0.82rem' }}>
              {data.rooms} room{data.rooms > 1 ? 's' : ''} · {data.students} students
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
const FS = {
  wrap: { marginTop: '1.5rem', padding: '1rem 1.25rem', background: COLORS.secondary, borderRadius: '10px' },
  title: { color: COLORS.textMuted, fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem' },
  pill: {
    display: 'flex', flexDirection: 'column', gap: '2px',
    background: COLORS.surface, borderRadius: '8px',
    padding: '8px 14px', border: `1px solid ${COLORS.border}`,
  },
};

// ── Styles ──
const S = {
  page: { padding: '2rem', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  header: {},
  title: { color: COLORS.textPrimary, fontSize: '1.8rem', margin: '0 0 0.5rem' },
  subtitle: { color: COLORS.textMuted, fontSize: '0.95rem', lineHeight: 1.7, margin: 0 },


  inputCard: {
    background: COLORS.surface,
    borderRadius: '16px',
    padding: '2rem',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  },
  sectionLabel: { color: COLORS.textPrimary, fontSize: '1rem', fontWeight: 700, margin: '0 0 1.25rem' },
  form: {},
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { color: COLORS.textFaint, fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' },
  inputRow: { display: 'flex', gap: '0.75rem' },
  input: {
    flex: 1,
    background: COLORS.secondary,
    border: `1px solid #1e3a5f`,
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    color: COLORS.textPrimary,
    fontSize: '1rem',
    outline: 'none',
  },
  inputErr: { borderColor: COLORS.primary },
  err: { color: COLORS.primary, fontSize: '0.8rem', fontWeight: 500 },
  allocBtn: {
    background: `linear-gradient(135deg, ${COLORS.primary}, #c0392b)`,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0 1.75rem',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },


  outputPanel: {
    background: COLORS.surface,
    borderRadius: '16px',
    padding: '2rem',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  },
  outputHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  resetBtn: {
    background: 'transparent', border: `1px solid ${COLORS.border}`,
    color: COLORS.textMuted, borderRadius: '6px', padding: '5px 14px',
    cursor: 'pointer', fontSize: '0.82rem',
  },

  insuffBox: { textAlign: 'center', padding: '1rem 0 2rem' },
  insuffIcon: { fontSize: '3.5rem', marginBottom: '0.75rem' },
  insuffTitle: { color: COLORS.amber, fontSize: '1.6rem', fontWeight: 800, margin: '0 0 1.5rem' },
  insuffGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '480px', margin: '0 auto 1.25rem' },
  insuffTip: { color: COLORS.textFaint, fontSize: '0.85rem' },

  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' },
  successMsg: {
    background: `${COLORS.green}15`, border: `1px solid ${COLORS.green}44`,
    color: COLORS.green, borderRadius: '8px', padding: '0.75rem 1.25rem',
    fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem',
  },
  tableHeading: { color: COLORS.textPrimary, fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '620px' },
  th: {
    background: COLORS.secondary, color: COLORS.textFaint,
    padding: '0.7rem 1rem', textAlign: 'left',
    fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  td: { padding: '0.8rem 1rem', color: COLORS.textMuted, fontSize: '0.88rem', verticalAlign: 'middle' },
  floorPill: { background: COLORS.secondary, color: COLORS.blue, padding: '2px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 },
  yesTag: { color: COLORS.green, fontWeight: 700, fontSize: '0.85rem' },
  noTag:  { color: COLORS.textFaint, fontSize: '0.85rem' },

  waiting: { textAlign: 'center', padding: '4rem 2rem' },
  waitingIcon: { fontSize: '4rem', marginBottom: '1rem' },
  waitingText: { color: COLORS.textMuted, fontSize: '0.95rem', maxWidth: '380px', margin: '0 auto', lineHeight: 1.6 },
};

export default AllocateExam;
