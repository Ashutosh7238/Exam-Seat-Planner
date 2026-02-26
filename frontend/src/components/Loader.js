import React from 'react';
import { COLORS } from '../utils/constants';

const Loader = ({ message = 'Loading...' }) => (
  <div style={S.wrap}>
    <div style={S.spinner} />
    <p style={S.text}>{message}</p>
  </div>
);

const S = {
  wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', gap: '1rem' },
  spinner: {
    width: '40px',
    height: '40px',
    border: `4px solid ${COLORS.border}`,
    borderTop: `4px solid ${COLORS.primary}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: { color: COLORS.textMuted, fontSize: '0.95rem' },
};

export default Loader;
