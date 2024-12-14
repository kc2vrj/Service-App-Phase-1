import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

export default function TimesheetEntryEdit({ entry, onSave, onCancel }) {
  const [editedEntry, setEditedEntry] = useState({
    ...entry,
    travelStart: entry.travelStart || '',
    timeIn: entry.timeIn || '',
    timeOut: entry.timeOut || '',
    travelHome: entry.travelHome || '',
    timeOnJob: entry.timeOnJob || '',
    customerName: entry.customerName || '',
    workOrder: entry.workOrder || '',
    address: entry.address || '',
    workPerformed: entry.workPerformed || ''
  });

  const calculateTimeOnJob = () => {
    if (!editedEntry.timeIn || !editedEntry.timeOut) return '';
    
    const inTime = new Date(`1970-01-01T${editedEntry.timeIn}`);
    const outTime = new Date(`1970-01-01T${editedEntry.timeOut}`);
    const diffMs = outTime - inTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const calculated = calculateTimeOnJob();
    setEditedEntry(prev => ({ ...prev, timeOnJob: calculated }));
  }, [editedEntry.timeIn, editedEntry.timeOut]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editedEntry.date || !editedEntry.customerName) return;
    onSave(editedEntry);
  };

  return (
    <tr className="border-t bg-blue-50">
      <td colSpan="10" className="px-4 py-2">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Time Information</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={editedEntry.date}
                  onChange={(e) => setEditedEntry({...editedEntry, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Travel Start</label>
                  <input
                    type="time"
                    value={editedEntry.travelStart}
                    onChange={(e) => setEditedEntry({...editedEntry, travelStart: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time In</label>
                  <input
                    type="time"
                    value={editedEntry.timeIn}
                    onChange={(e) => setEditedEntry({...editedEntry, timeIn: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Out</label>
                  <input
                    type="time"
                    value={editedEntry.timeOut}
                    onChange={(e) => setEditedEntry({...editedEntry, timeOut: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Travel Home</label>
                  <input
                    type="time"
                    value={editedEntry.travelHome}
                    onChange={(e) => setEditedEntry({...editedEntry, travelHome: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time on Job</label>
                <input
                  type="text"
                  value={editedEntry.timeOnJob}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Customer Information</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  value={editedEntry.customerName}
                  onChange={(e) => setEditedEntry({...editedEntry, customerName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">WO#/Job#</label>
                <input
                  value={editedEntry.workOrder}
                  onChange={(e) => setEditedEntry({...editedEntry, workOrder: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  value={editedEntry.address}
                  onChange={(e) => setEditedEntry({...editedEntry, address: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Work Details</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Work Performed</label>
                <textarea
                  value={editedEntry.workPerformed}
                  onChange={(e) => setEditedEntry({...editedEntry, workPerformed: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="8"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 bg-gray-50">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}