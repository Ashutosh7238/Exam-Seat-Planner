import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, APP_NAME, COLORS } from '../utils/constants';

const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav style={S.nav}>
      <div style={S.brand}>
        <span style={S.logo}>🎓</span>
        <span style={S.brandName}>{APP_NAME}</span>

      </div>

      {/* Desktop links */}
      <ul style={S.linkList}>
        {NAV_LINKS.map(({ path, label, icon }) => (
          <li key={path}>
            <Link
              to={path}
              style={{
                ...S.link,
                ...(pathname === path ? S.activeLink : {}),
              }}
            >
              <span>{icon}</span> {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button style={S.hamburger} onClick={() => setOpen(!open)} aria-label="menu">
        {open ? '✕' : '☰'}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div style={S.drawer}>
          {NAV_LINKS.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              style={{
                ...S.drawerLink,
                ...(pathname === path ? S.drawerActive : {}),
              }}
              onClick={() => setOpen(false)}
            >
              {icon} {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

const S = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 999,
    background: '#111827',
    borderBottom: `2px solid ${COLORS.primary}22`,
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '62px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  logo: { fontSize: '1.8rem' },
  brandName: { color: COLORS.primary, fontWeight: 800, fontSize: '1.15rem', letterSpacing: '0.5px' },

  linkList: {
    listStyle: 'none',
    display: 'flex',
    gap: '4px',
    margin: 0,
    padding: 0,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: COLORS.textMuted,
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '0.88rem',
    fontWeight: 500,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  activeLink: {
    background: COLORS.primary,
    color: '#fff',
    fontWeight: 700,
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: COLORS.textPrimary,
    fontSize: '1.4rem',
    cursor: 'pointer',
  },
  drawer: {
    position: 'absolute',
    top: '62px',
    left: 0,
    right: 0,
    background: '#111827',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    gap: '0.5rem',
    borderBottom: `2px solid ${COLORS.border}`,
    zIndex: 998,
  },
  drawerLink: {
    color: COLORS.textMuted,
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  drawerActive: {
    background: COLORS.primary,
    color: '#fff',
  },
};

export default Navbar;
