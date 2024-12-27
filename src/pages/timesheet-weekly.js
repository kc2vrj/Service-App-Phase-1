// Weekly Timesheet View Component
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import TimesheetTable from '../components/timesheet/TimesheetTable';
import { useTimesheetOperations } from '../hooks/useTimesheetOperations';
import TimesheetForm from '../components/TimesheetForm';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import UserSelector from '../components/UserSelector';
import { hasAccess } from '@/lib/utils/role-utils';

export default function WeeklyView() {
  const router = useRouter();
  const { user } = useAuth();
  const { updateEntry, deleteEntry } = useTimesheetOperations();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(user?.uid || user?.id);
  const [entries, setEntries] = useState([]);

  // Check authentication
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Get the current week's dates
  function getWeekDates(date) {
    const curr = new Date(date);
    curr.setHours(0, 0, 0, 0);
    const day = curr.getDay(); // Get current day number (0-6)
    const diff = curr.getDate() - day; // Adjust to get to Sunday
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(curr);
      dayDate.setDate(diff + i);
      weekDates.push(dayDate.toISOString().split('T')[0]);
    }
    return weekDates;
  }

  // Initialize with current date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeekDates(currentDate));

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
    setCurrentWeek(getWeekDates(newDate));
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    setCurrentWeek(getWeekDates(newDate));
  };

  const fetchEntries = async (weekDates) => {
    if (!user || !selectedUserId) return;
    
    setLoading(true);
    try {
      const startDate = weekDates[0];
      const endDate = weekDates[6];
      
      console.log('Fetching entries from', startDate, 'to', endDate);
      
      const entriesRef = collection(db, 'timesheet_entries');
      const q = query(
        entriesRef,
        where('userId', '==', selectedUserId),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );

      const snapshot = await getDocs(q);
      const entriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => a.date.localeCompare(b.date));

      console.log('Found entries:', entriesData);
      setEntries(entriesData);
      setError(null);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = async (formData) => {
    try {
      await updateEntry(editingEntry.id, formData);
      setEditingEntry(null);
      fetchEntries(currentWeek);
    } catch (error) {
      console.error('Error updating entry:', error);
      throw new Error('Failed to update entry');
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await deleteEntry(id);
      fetchEntries(currentWeek);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  // Calculate total hours for the week
  const calculateTotalHours = (entries) => {
    return entries.reduce((total, entry) => {
      if (entry.timeIn && entry.timeOut) {
        const [inHours, inMinutes] = entry.timeIn.split(':').map(Number);
        const [outHours, outMinutes] = entry.timeOut.split(':').map(Number);
        const timeInMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
        return total + (timeInMinutes / 60);
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    if (!user || !selectedUserId) return;
    fetchEntries(currentWeek);
  }, [currentWeek, user, selectedUserId]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatDateRange = (dates) => {
    const start = new Date(dates[0]);
    const end = new Date(dates[6]);
    return `${start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} - ${end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })}`;
  };

  return (
    <div className="p-6">
      {hasAccess(user, ['ADMIN', 'SUPER_ADMIN']) && (
        <UserSelector
          selectedUserId={selectedUserId}
          onUserSelect={setSelectedUserId}
        />
      )}

      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <button
          onClick={handlePrevWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-lg font-semibold">
          {formatDateRange(currentWeek)}
        </div>

        <button
          onClick={handleNextWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Next week"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg flex items-center gap-2">
          <AlertTriangle className="text-yellow-500" />
          <span className="text-yellow-700">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <TimesheetTable
          entries={entries}
          onEdit={setEditingEntry}
          onDelete={handleDeleteEntry}
        />
        {entries.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <div className="text-right text-sm text-gray-600">
              Total Hours: <span className="font-semibold">{calculateTotalHours(entries).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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