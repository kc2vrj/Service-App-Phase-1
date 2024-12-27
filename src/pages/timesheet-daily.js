import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ModernTimesheetForm from '../components/ModernTimesheetForm';
import { useTheme } from '../hooks/useTheme';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTimesheetOperations } from '../hooks/useTimesheetOperations';
import TimesheetTable from '../components/timesheet/TimesheetTable';
import UserSelector from '../components/UserSelector';
import { hasAccess } from '@/lib/utils/role-utils';

export default function DailyView() {
  const router = useRouter();
  const { user } = useAuth();
  const { updateEntry, deleteEntry, addEntry } = useTimesheetOperations();
  const { getColor, getSpacing, getShadow } = useTheme();
  
  const [editingEntry, setEditingEntry] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchEntries();
  }, [selectedUserId, user]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      // Implement your fetch logic here
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await addEntry(formData);
      await fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateEntry = async (formData) => {
    try {
      await updateEntry(editingEntry.id, formData);
      setEditingEntry(null);
      await fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await deleteEntry(entryId);
      await fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return null;

  const isAdmin = user?.role && hasAccess(user.role, 'ADMIN');

  return (
    <Layout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 
            className="text-3xl font-bold"
            style={{ color: getColor('text.primary') }}
          >
            Daily Timesheet
          </h1>
          <p 
            className="text-lg"
            style={{ color: getColor('text.secondary') }}
          >
            Track your daily work activities and locations
          </p>
        </div>

        {isAdmin && (
          <div 
            className="p-6 rounded-lg"
            style={{
              backgroundColor: getColor('background.paper'),
              boxShadow: getShadow('sm'),
              borderColor: getColor('border.main'),
              borderWidth: '1px'
            }}
          >
            <h2 
              className="text-lg font-semibold mb-4"
              style={{ color: getColor('text.primary') }}
            >
              User Selection
            </h2>
            <UserSelector
              selectedUserId={selectedUserId}
              onUserSelect={setSelectedUserId}
            />
          </div>
        )}

        {error && (
          <div 
            className="p-4 rounded-lg flex items-center gap-2"
            style={{
              backgroundColor: getColor('status.error') + '10',
              color: getColor('status.error')
            }}
          >
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        <div className="grid gap-8">
          {editingEntry ? (
            <ModernTimesheetForm
              initialData={editingEntry}
              onSubmit={handleUpdateEntry}
              onCancel={() => setEditingEntry(null)}
            />
          ) : (
            <ModernTimesheetForm onSubmit={handleSubmit} />
          )}

          <div
            className="rounded-lg overflow-hidden"
            style={{
              backgroundColor: getColor('background.paper'),
              boxShadow: getShadow('sm')
            }}
          >
            <div 
              className="p-4 border-b"
              style={{ 
                borderColor: getColor('border.main'),
                backgroundColor: getColor('background.paper')
              }}
            >
              <h2 
                className="text-xl font-semibold"
                style={{ color: getColor('text.primary') }}
              >
                Today's Entries
              </h2>
            </div>
            
            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 
                    className="w-8 h-8 animate-spin"
                    style={{ color: getColor('text.secondary') }}
                  />
                </div>
              ) : entries.length > 0 ? (
                <TimesheetTable
                  entries={entries}
                  onEdit={setEditingEntry}
                  onDelete={handleDeleteEntry}
                />
              ) : (
                <div 
                  className="p-8 text-center"
                  style={{ color: getColor('text.secondary') }}
                >
                  No entries found for today
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}