import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import TimesheetTable from '../components/timesheet/TimesheetTable';
import { useTimesheetOperations } from '../hooks/useTimesheetOperations';
import TimesheetForm from '../components/TimesheetForm';
import Logo from '../components/Logo';

export default function DailyView() {
  const { user } = useAuth();
  const [editingEntry, setEditingEntry] = useState(null);
  const { updateEntry, deleteEntry } = useTimesheetOperations();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const q = query(
        collection(db, 'timesheet_entries'),
        where('userId', '==', user.id),
        where('date', '==', new Date().toISOString().split('T')[0])
      );
      
      const snapshot = await getDocs(q);
      const entriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(entriesData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const handleSubmit = async (formData) => {
    try {
      const entriesRef = collection(db, 'timesheet_entries');
      await addDoc(entriesRef, {
        ...formData,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        createdAt: new Date().toISOString()
      });
      
      fetchEntries();
    } catch (error) {
      console.error('Error adding entry:', error);
      throw new Error('Failed to add timesheet entry');
    }
  };

  const handleUpdateEntry = async (formData) => {
    try {
      await updateEntry(editingEntry.id, formData);
      setEditingEntry(null);
      fetchEntries();
    } catch (error) {
      console.error('Error updating entry:', error);
      throw new Error('Failed to update entry');
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteEntry(id);
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
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
      <TimesheetForm 
        onSubmit={handleSubmit}
        initialData={{
          date: new Date().toISOString().split('T')[0]
        }}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-8">
        {entries.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No entries for today</p>
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