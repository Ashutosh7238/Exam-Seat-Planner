import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClassroomProvider } from './context/ClassroomContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddClassroom from './pages/AddClassroom';
import ViewClassrooms from './pages/ViewClassrooms';
import AllocateExam from './pages/AllocateExam';
import { ROUTES } from './utils/constants';
import './index.css';

function App() {
  return (
    <ClassroomProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path={ROUTES.DASHBOARD}     element={<Dashboard />} />
              <Route path={ROUTES.ADD_CLASSROOM} element={<AddClassroom />} />
              <Route path={ROUTES.CLASSROOMS}    element={<ViewClassrooms />} />
              <Route path={ROUTES.ALLOCATE}      element={<AllocateExam />} />
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Routes>
          </main>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#16213e',
              color: '#e2e8f0',
              border: '1px solid #0f3460',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#16213e' } },
            error:   { iconTheme: { primary: '#e94560', secondary: '#16213e' } },
          }}
        />
      </Router>
    </ClassroomProvider>
  );
}

export default App;
