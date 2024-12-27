/**
 * TimesheetTable Component
 * Displays timesheet entries in a table format with actions
 * Memoized to prevent unnecessary re-renders
 * 
 * @param {Object[]} entries - Array of timesheet entries to display
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 */

import { memo } from 'react';
import TimesheetEntry from './TimesheetEntry';

const TimesheetTable = memo(({ entries, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full whitespace-nowrap">
      {/* Table header with column names */}
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
      {/* Table body with timesheet entries */}
      <tbody>
        {entries.map(entry => (
          <TimesheetEntry
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  </div>
));

TimesheetTable.displayName = 'TimesheetTable';
export default TimesheetTable;