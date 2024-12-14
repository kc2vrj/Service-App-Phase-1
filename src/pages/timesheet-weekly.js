import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import TimesheetTable from '../components/timesheet/TimesheetTable';
import { useTimesheetOperations } from '../hooks/useTimesheetOperations';
import TimesheetForm from '../components/TimesheetForm';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

export default function WeeklyView() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(getWeekDates());
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateEntry, deleteEntry } = useTimesheetOperations();
  const [editingEntry, setEditingEntry] = useState(null);

  function getWeekDates(date = new Date()) {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    
    return Array(7).fill().map((_, i) => {
      const day = new Date(curr.setDate(first + i));
      return day.toISOString().split('T')[0];
    });
  }

  useEffect(() => {
    const fetchWeekEntries = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);

        // Simplified query to avoid index requirement initially
        const entriesRef = collection(db, 'timesheet_entries');
        const q = query(
          entriesRef,
          where('userId', '==', user.id)
        );
        
        const snapshot = await getDocs(q);
        const allEntries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter dates client-side
        const weeklyEntries = allEntries.filter(entry => 
          entry.date >= currentWeek[0] && 
          entry.date <= currentWeek[6]
        ).sort((a, b) => b.date.localeCompare(a.date));
        
        setEntries(weeklyEntries);
      } catch (error) {
        console.error('Error fetching entries:', error);
        if (error.message.includes('requires an index')) {
          setError({
            type: 'index',
            message: 'Database indexes are being built. This may take a few minutes.',
            details: error.message
          });
        } else {
          setError({
            type: 'general',
            message: 'Failed to load timesheet entries.',
            details: error.message
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeekEntries();
  }, [currentWeek, user]);

  const changeWeek = (direction) => {
    setCurrentWeek(prevWeek => {
      const firstDay = new Date(prevWeek[0]);
      firstDay.setDate(firstDay.getDate() + (direction === 'next' ? 7 : -7));
      return getWeekDates(firstDay);
    });
  };

  const handleUpdateEntry = async (data) => {
    try {
      await updateEntry(editingEntry.id, data);
      setEditingEntry(null);
      // Refresh entries by triggering the useEffect
      setCurrentWeek([...currentWeek]);
    } catch (error) {
      console.error('Error updating entry:', error);
      setError({
        type: 'general',
        message: 'Failed to update entry. Please try again.',
        details: error.message
      });
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteEntry(id);
      // Remove entry from local state
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError({
        type: 'general',
        message: 'Failed to delete entry. Please try again.',
        details: error.message
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <button
          onClick={() => changeWeek('prev')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Previous week"
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
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Next week"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className={`mb-6 p-4 rounded-lg ${
          error.type === 'index' 
            ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">{error.message}</span>
          </div>
          {error.type === 'index' && (
            <p className="mt-2 text-sm ml-7">
              This is a one-time setup process. Please refresh the page in a few moments.
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No timesheet entries found for this week.
          </div>
        ) : (
          <TimesheetTable
            entries={entries}
            onEdit={setEditingEntry}
            onDelete={handleDeleteEntry}
          />
        )}
      </div>
      
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full">
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
}