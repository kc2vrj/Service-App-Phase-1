import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Edit2, MapPin } from 'lucide-react';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import TimesheetForm from './TimesheetForm';

const TimesheetEntry = ({ entry, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2">{entry.date}</td>
      <td className="px-4 py-2 whitespace-normal">
        {entry.travelStart && (
          <div className="py-1">
            <div>{entry.travelStart}</div>
            {entry.addresses?.travelStart && (
              <div className="text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                {entry.addresses.travelStart}
              </div>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-2 whitespace-normal">
        {entry.timeIn && (
          <div className="py-1">
            <div>{entry.timeIn}</div>
            {entry.addresses?.timeIn && (
              <div className="text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                {entry.addresses.timeIn}
              </div>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-2 whitespace-normal">
        {entry.timeOut && (
          <div className="py-1">
            <div>{entry.timeOut}</div>
            {entry.addresses?.timeOut && (
              <div className="text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                {entry.addresses.timeOut}
              </div>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-2 whitespace-normal">
        {entry.travelHome && (
          <div className="py-1">
            <div>{entry.travelHome}</div>
            {entry.addresses?.travelHome && (
              <div className="text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                {entry.addresses.travelHome}
              </div>
            )}
          </div>
        )}
      </td>
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
};

const TimesheetApp = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const entriesRef = collection(db, 'timesheet_entries');
    const q = query(entriesRef, where('userId', '==', user.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(entriesData.sort((a, b) => b.date.localeCompare(a.date)));
    }, (err) => {
      console.error('Error fetching entries:', err);
      setError('Failed to load timesheet entries');
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddEntry = async (formData) => {
    try {
      const entriesRef = collection(db, 'timesheet_entries');
      await addDoc(entriesRef, {
        ...formData,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding entry:', error);
      throw new Error('Failed to add timesheet entry');
    }
  };

  const handleUpdateEntry = async (formData) => {
    try {
      const { id, ...updateData } = formData;
      await updateDoc(doc(db, 'timesheet_entries', id), updateData);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
      throw new Error('Failed to update timesheet entry');
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteDoc(doc(db, 'timesheet_entries', id));
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">New Timesheet Entry</h2>
          <TimesheetForm 
            onSubmit={handleAddEntry} 
            initialData={{
              date: new Date().toISOString().split('T')[0]
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Timesheet Entries</h2>
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
                    onEdit={setEditingEntry}
                    onDelete={handleDeleteEntry}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Timesheet Entry</h2>
              <TimesheetForm 
                initialData={editingEntry}
                onSubmit={handleUpdateEntry}
                onCancel={() => setEditingEntry(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesheetApp;