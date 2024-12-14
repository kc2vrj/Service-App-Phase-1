// src/components/timesheet/TimesheetEntry.js
import { memo } from 'react';
import { Edit2, Trash2, MapPin } from 'lucide-react';

const TimesheetEntry = memo(({ entry, onEdit, onDelete }) => {
  const renderLocation = (field) => {
    if (!entry[field]) return null;
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

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2">{entry.date}</td>
      <td className="px-4 py-2 whitespace-normal">{renderLocation('travelStart')}</td>
      <td className="px-4 py-2 whitespace-normal">{renderLocation('timeIn')}</td>
      <td className="px-4 py-2 whitespace-normal">{renderLocation('timeOut')}</td>
      <td className="px-4 py-2 whitespace-normal">{renderLocation('travelHome')}</td>
      <td className="px-4 py-2">{entry.customerName}</td>
      <td className="px-4 py-2">{entry.workOrder}</td>
      <td className="px-4 py-2">{entry.address}</td>
      <td className="px-4 py-2">{entry.notes}</td>
      <td className="px-4 py-2">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(entry)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

TimesheetEntry.displayName = 'TimesheetEntry';
export default TimesheetEntry;