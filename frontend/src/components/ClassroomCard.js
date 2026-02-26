import React from 'react';
import { COLORS } from '../utils/constants';

const capacityColor = (cap) => {
  if (cap >= 60) return COLORS.green;
  if (cap >= 30) return '#f59e0b';
  return COLORS.primary;
};

const ClassroomCard = ({ room, onDelete, deleting }) => (
  <div style={S.card}>
    <div style={S.header}>
      <span style={S.roomId}>{room.roomId}</span>
      <span style={S.floorBadge}>Floor {room.floorNo}</span>
    </div>

    <div style={S.body}>
      <Row icon="💺" label={`${room.capacity} seats`} />
      <Row
        icon="🚻"
        label={room.nearWashroom ? 'Near Washroom' : 'Not Near Washroom'}
        valueStyle={room.nearWashroom ? S.yes : S.no}
      />
    </div>

    {/* Capacity indicator */}
    <div style={S.barTrack}>
      <div
        style={{
          ...S.barFill,
          width: `${Math.min((room.capacity / 100) * 100, 100)}%`,
          background: capacityColor(room.capacity),
        }}
      />
    </div>

    <button
      style={S.deleteBtn}
      onClick={() => onDelete(room._id, room.roomId)}
      disabled={deleting === room._id}
    >
      {deleting === room._id ? '⏳ Deleting...' : '🗑️ Delete'}
    </button>
  </div>
);

const Row = ({ icon, label, valueStyle }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span>{icon}</span>
    <span style={{ ...S.rowText, ...valueStyle }}>{label}</span>
  </div>
);

const S = {
  card: {
    background: COLORS.surface,
    borderRadius: '12px',
    padding: '1.25rem',
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  roomId: { color: COLORS.textPrimary, fontWeight: 800, fontSize: '1.05rem' },
  floorBadge: {
    background: COLORS.secondary,
    color: COLORS.blue,
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  body: { display: 'flex', flexDirection: 'column', gap: '6px' },
  rowText: { color: COLORS.textMuted, fontSize: '0.88rem' },
  yes: { color: COLORS.green, fontWeight: 600 },
  no: { color: COLORS.textFaint },
  barTrack: {
    background: COLORS.secondary,
    borderRadius: '4px',
    height: '4px',
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 0.4s' },
  deleteBtn: {
    background: 'transparent',
    border: `1px solid ${COLORS.primary}`,
    color: COLORS.primary,
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
    transition: 'all 0.15s',
    marginTop: '4px',
  },
};

export default ClassroomCard;
