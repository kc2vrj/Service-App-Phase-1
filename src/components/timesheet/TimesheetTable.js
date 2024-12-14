// src/components/timesheet/TimesheetTable.js
import { memo } from 'react';
import TimesheetEntry from './TimesheetEntry';

const TimesheetTable = memo(({ entries, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
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