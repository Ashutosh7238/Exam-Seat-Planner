import React from 'react';
import { COLORS } from '../utils/constants';

const StatCard = ({ icon, label, value, color = COLORS.primary, loading = false }) => (
  <div style={{ ...S.card, borderTop: `4px solid ${color}` }}>
    {loading ? (
      <div style={S.skeleton} />
    ) : (
      <>
        <span style={S.icon}>{icon}</span>
        <div style={{ ...S.value, color }}>{value}</div>
        <div style={S.label}>{label}</div>
      </>
    )}
  </div>
);

const S = {
  card: {
    background: COLORS.surface,
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    border: `1px solid ${COLORS.border}`,
  },
  icon: { fontSize: '2rem' },
  value: { fontSize: '2.4rem', fontWeight: 800, margin: '0.3rem 0' },
  label: { color: COLORS.textMuted, fontSize: '0.85rem', fontWeight: 500 },
  skeleton: {
    height: '80px',
    background: COLORS.secondary,
    borderRadius: '8px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};

export default StatCard;
