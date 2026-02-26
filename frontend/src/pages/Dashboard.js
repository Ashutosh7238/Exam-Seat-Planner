import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClassrooms } from '../context/ClassroomContext';
import StatCard from '../components/StatCard';
import { COLORS, ROUTES } from '../utils/constants';

const Dashboard = () => {
  const { stats, loading, fetchClassrooms } = useClassrooms();

  useEffect(() => { fetchClassrooms(); }, [fetchClassrooms]);

  const statItems = [
    { icon: '🏫', label: 'Total Classrooms', value: stats.totalRooms,    color: '#818cf8' },
    { icon: '💺', label: 'Total Seats',      value: stats.totalCapacity, color: COLORS.green },
    { icon: '🏢', label: 'Floors Covered',   value: stats.totalFloors,   color: '#f59e0b' },
    { icon: '🚻', label: 'Near Washroom',    value: stats.nearWashroom,  color: COLORS.blue },
  ];

  const quickActions = [
    { to: ROUTES.ADD_CLASSROOM, icon: '➕', title: 'Add Classroom',    desc: 'Register a new classroom with capacity and floor details' },
    { to: ROUTES.CLASSROOMS,    icon: '📋', title: 'View Classrooms',  desc: 'Browse, search and manage all registered classrooms' },
  ];

  return (
    <div style={S.page}>

      {/* Hero */}
      <section style={S.hero}>
        <h1 style={S.heroTitle}>College Exam Seat Planner</h1>
        <p style={S.heroSub}>
Easily manage classrooms and allocate exam seats in seconds.        </p>
      </section>

      {/* Stats */}
      <section>
        <h2 style={S.sectionTitle}>📊 Overview</h2>
        <div style={S.statsGrid}>
          {statItems.map((s) => (
            <StatCard key={s.label} {...s} loading={loading} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 style={S.sectionTitle}>⚡ Quick Actions</h2>
        <div style={S.actionsGrid}>
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to} style={S.actionCard}>
              <span style={S.actionIcon}>{a.icon}</span>
              <h3 style={S.actionTitle}>{a.title}</h3>
              <p style={S.actionDesc}>{a.desc}</p>
              <span style={S.actionArrow}>Go →</span>
            </Link>
          ))}
        </div>
      </section>


    </div>
  );
};

const S = {
  page: { padding: '2rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    borderRadius: '16px',
    padding: '3rem 2rem',
    textAlign: 'center',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },

  heroTitle: { color: COLORS.textPrimary, fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.75rem' },
  heroSub: { color: COLORS.textMuted, fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' },
  actionCard: {
    background: COLORS.surface,
    borderRadius: '14px',
    padding: '1.5rem',
    border: `1px solid ${COLORS.border}`,
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    transition: 'transform 0.2s, border-color 0.2s',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
  },
  actionIcon: { fontSize: '2rem' },
  actionTitle: { color: COLORS.textPrimary, fontSize: '1rem', fontWeight: 700, margin: 0 },
  actionDesc: { color: COLORS.textMuted, fontSize: '0.85rem', margin: 0, lineHeight: 1.5 },
  actionArrow: { color: COLORS.primary, fontWeight: 700, fontSize: '0.9rem', marginTop: '0.5rem' },
};

export default Dashboard;
