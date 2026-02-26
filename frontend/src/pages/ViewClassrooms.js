import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deleteClassroom } from '../utils/api';
import { useClassrooms } from '../context/ClassroomContext';
import ClassroomCard from '../components/ClassroomCard';
import Loader from '../components/Loader';
import { COLORS } from '../utils/constants';

const ViewClassrooms = () => {
  const { classrooms, loading, fetchClassrooms } = useClassrooms();
  const [search, setSearch]       = useState('');
  const [floorFilter, setFloor]   = useState('all');
  const [sortBy, setSortBy]       = useState('floor');
  const [deleting, setDeleting]   = useState(null);

  useEffect(() => { fetchClassrooms(); }, [fetchClassrooms]);

  const floors = [...new Set(classrooms.map((c) => c.floorNo))].sort((a, b) => a - b);

  const filtered = classrooms
    .filter((c) => {
      const matchSearch = c.roomId.toLowerCase().includes(search.toLowerCase());
      const matchFloor  = floorFilter === 'all' || c.floorNo === Number(floorFilter);
      return matchSearch && matchFloor;
    })
    .sort((a, b) => {
      if (sortBy === 'floor')     return a.floorNo - b.floorNo;
      if (sortBy === 'capacity')  return b.capacity - a.capacity;
      if (sortBy === 'roomId')    return a.roomId.localeCompare(b.roomId);
      return 0;
    });

  const handleDelete = async (id, roomId) => {
    if (!window.confirm(`Delete classroom "${roomId}"? This action cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteClassroom(id);
      toast.success(`Classroom "${roomId}" deleted successfully`);
      fetchClassrooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const totalFiltered = filtered.reduce((s, c) => s + c.capacity, 0);

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>📋 View All Classrooms</h1>
          <p style={S.subtitle}>
            {classrooms.length} registered rooms &nbsp;|&nbsp;
            {classrooms.reduce((s, c) => s + c.capacity, 0)} total seats
          </p>
        </div>
        <div style={S.countBadge}>{filtered.length} shown</div>
      </div>

      {/* Filters */}
      <div style={S.filters}>
        <input
          style={S.searchInput}
          placeholder="🔍 Search by Room ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={S.select} value={floorFilter} onChange={(e) => setFloor(e.target.value)}>
          <option value="all">All Floors</option>
          {floors.map((f) => <option key={f} value={f}>Floor {f}</option>)}
        </select>
        <select style={S.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="floor">Sort: Floor ↑</option>
          <option value="capacity">Sort: Capacity ↓</option>
          <option value="roomId">Sort: Room ID A–Z</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Fetching classrooms..." />
      ) : filtered.length === 0 ? (
        <div style={S.empty}>
          <div style={S.emptyIcon}>{classrooms.length === 0 ? '🏫' : '🔍'}</div>
          <h3 style={S.emptyTitle}>
            {classrooms.length === 0 ? 'No Classrooms Found' : 'No Results'}
          </h3>
          <p style={S.emptyText}>
            {classrooms.length === 0
              ? 'Start by adding classrooms from the "Add Classroom" page.'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <>
          <div style={S.grid}>
            {filtered.map((room) => (
              <ClassroomCard
                key={room._id}
                room={room}
                onDelete={handleDelete}
                deleting={deleting}
              />
            ))}
          </div>
          <div style={S.footer}>
            Showing <strong style={{ color: COLORS.primary }}>{filtered.length}</strong> rooms &nbsp;·&nbsp;
            Total capacity: <strong style={{ color: COLORS.green }}>{totalFiltered}</strong> seats
          </div>
        </>
      )}
    </div>
  );
};

const S = {
  page: { padding: '2rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  title: { color: COLORS.textPrimary, fontSize: '1.8rem', margin: '0 0 4px' },
  subtitle: { color: COLORS.textMuted, fontSize: '0.9rem', margin: 0 },
  countBadge: { background: COLORS.secondary, color: COLORS.blue, padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 },
  filters: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    padding: '0.7rem 1rem',
    color: COLORS.textPrimary,
    fontSize: '0.9rem',
    outline: 'none',
  },
  select: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    padding: '0.7rem 1rem',
    color: COLORS.textPrimary,
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' },
  empty: { textAlign: 'center', padding: '4rem 2rem' },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
  emptyTitle: { color: COLORS.textPrimary, fontSize: '1.2rem', marginBottom: '0.5rem' },
  emptyText: { color: COLORS.textMuted, fontSize: '0.9rem', maxWidth: '320px', margin: '0 auto' },
  footer: { color: COLORS.textFaint, fontSize: '0.85rem', textAlign: 'right' },
};

export default ViewClassrooms;
