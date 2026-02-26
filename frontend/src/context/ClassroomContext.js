import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllClassrooms } from '../utils/api';

const ClassroomContext = createContext(null);

export const ClassroomProvider = ({ children }) => {
  const [classrooms, setClassrooms]   = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const fetchClassrooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllClassrooms();
      setClassrooms(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch classrooms');
    } finally {
      setLoading(false);
    }
  }, []);

  // Derived stats
  const stats = {
    totalRooms:    classrooms.length,
    totalCapacity: classrooms.reduce((s, c) => s + c.capacity, 0),
    totalFloors:   new Set(classrooms.map((c) => c.floorNo)).size,
    nearWashroom:  classrooms.filter((c) => c.nearWashroom).length,
  };

  return (
    <ClassroomContext.Provider
      value={{ classrooms, loading, error, fetchClassrooms, setClassrooms, stats }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};

export const useClassrooms = () => {
  const context = useContext(ClassroomContext);
  if (!context) throw new Error('useClassrooms must be used within ClassroomProvider');
  return context;
};
