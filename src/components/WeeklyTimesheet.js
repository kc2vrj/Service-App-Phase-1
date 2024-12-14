import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import TimesheetForm from './TimesheetForm';

const WeeklyTimesheet = ({ user }) => {
  const [currentWeek, setCurrentWeek] = useState(getWeekDates());
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  function getWeekDates(date = new Date()) {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    
    return Array(7).fill().map((_, i) => {
      const day = new Date(curr.setDate(first + i));
      return day.toISOString().split('T')[0];
    });
  }

  useEffect(() => {
    if (!user) return;

    const fetchWeekEntries = async () => {
      setLoading(true);
      try {
        const entriesRef = collection(db, 'timesheet_entries');
        const q = query(
          entriesRef,
          where('userId', '==', user.id)
        );

        const snapshot = await getDocs(q);
        let allEntries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        allEntries = allEntries
          .filter(entry => entry.date >= currentWeek[0] && entry.date <= currentWeek[6])
          .sort((a, b) => b.date.localeCompare(a.date));

        setEntries(allEntries);
        setError(null);
      } catch (error) {
        console.error('Error fetching entries:', error);
        setError('Failed to load timesheet entries');
      } finally {
        setLoading(false);
      }
    };

    fetchWeekEntries();
  }, [currentWeek[0], user]);

  const changeWeek = (direction) => {
    setCurrentWeek(prevWeek => {
      const firstDay = new Date(prevWeek[0]);
      firstDay.setDate(firstDay.getDate() + (direction === 'next' ? 7 : -7));
      return getWeekDates(firstDay);
    });
  };

  const handleUpdateEntry = async (formData) => {
    try {
      const { id, ...updateData } = formData;
      await updateDoc(doc(db, 'timesheet_entries', id), updateData);
      setEditingEntry(null);
      
      // Update local state
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === id ? { ...entry, ...updateData } : entry
        )
      );
    } catch (error) {
      console.error('Error updating entry:', error);
      setError('Failed to update entry');
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await deleteDoc(doc(db, 'timesheet_entries', id));
      // Update local state
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('Failed to delete entry');
    }
  };

  const renderLocation = (entry, field) => {
    if (!entry[field]) return '-';
    
    return (
      <div className="py-1">
        <div>{entry[field]}</div>
        {entry.addresses?.[field] && (
          <div className="text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3 inline mr-1" />
            {entry.addresses[field]}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <button
          onClick={() => changeWeek('prev')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-lg font-semibold">
          {new Date(currentWeek[0]).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
          })}
          {' - '}
          {new Date(currentWeek[6]).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>

        <button
          onClick={() => changeWeek('next')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Travel Start</th>
              <th className="px-4 py-2 text-left">Time In</th>
              <th className="px-4 py-2 text-left">Time Out</th>
              <th className="px-4 py-2 text-left">Travel Home</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">WO#</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Notes</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2 whitespace-normal">
                  {renderLocation(entry, 'travelStart')}
                </td>
                <td className="px-4 py-2 whitespace-normal">
                  {renderLocation(entry, 'timeIn')}
                </td>
                <td className="px-4 py-2 whitespace-normal">
                  {renderLocation(entry, 'timeOut')}
                </td>
                <td className="px-4 py-2 whitespace-normal">
                  {renderLocation(entry, 'travelHome')}
                </td>
                <td className="px-4 py-2">{entry.customerName}</td>
                <td className="px-4 py-2">{entry.workOrder}</td>
                <td className="px-4 py-2">{entry.address}</td>
                <td className="px-4 py-2">{entry.notes}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingEntry(entry)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <TimesheetForm 
              initialData={editingEntry}
              onSubmit={handleUpdateEntry}
              onCancel={() => setEditingEntry(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyTimesheet;