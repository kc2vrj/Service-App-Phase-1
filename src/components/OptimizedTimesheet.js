// components/OptimizedTimesheet.js
import React, { useCallback, memo } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';
import { sanitizeInput } from '../middleware/security';

const TimesheetEntry = memo(({ entry, onEdit }) => {
  const handleEdit = useCallback(() => {
    onEdit(entry);
  }, [entry, onEdit]);

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h3 className="font-bold">{entry.customerName}</h3>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <p>Date: {entry.date}</p>
          <p>Time In: {entry.timeIn}</p>
          <p>Time Out: {entry.timeOut}</p>
        </div>
        <div>
          <p>Work Order: {entry.workOrder}</p>
          <p>Notes: {entry.notes}</p>
        </div>
      </div>
      <button
        onClick={handleEdit}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Edit
      </button>
    </div>
  );
});

TimesheetEntry.displayName = 'TimesheetEntry';

const OptimizedTimesheet = () => {
  const { user } = useAuth();
  const { items: entries, loading, error, loadMore, hasMore } = useFirestore(
    'timesheet_entries',
    [where('userId', '==', user?.id)],
    10
  );

  const handleSubmit = useCallback(async (data) => {
    const sanitizedData = sanitizeInput(data);
    // Submit logic here
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        {entries.map(entry => (
          <TimesheetEntry
            key={entry.id}
            entry={entry}
            onEdit={handleEdit}
          />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={loadMore}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default OptimizedTimesheet;