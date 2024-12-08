import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Edit2, MapPin } from 'lucide-react';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import TimesheetForm from './TimesheetForm';

const TimesheetApp = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);

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
    }
  };

  const handleUpdateEntry = async (formData) => {
    try {
      const { id, ...updateData } = formData;
      await updateDoc(doc(db, 'timesheet_entries', id), updateData);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
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

  const renderLocation = (entry, field) => {
    if (!entry[field]) return '-';
    
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
    <div className="p-6">
      <TimesheetForm 
        onSubmit={handleAddEntry} 
        initialData={{
          date: new Date().toISOString().split('T')[0]
        }}
      />
      
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <TimesheetForm 
              initialData={editingEntry}
              onSubmit={handleUpdateEntry}
              onCancel={() => setEditingEntry(null)}
            />
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
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
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2 whitespace-normal">
                  {renderLocation(entry, 'travelStart')}
                </td>
                <td className="px-4 py-2 whitespace-normal">
                  {renderLocation(entry, 'timeIn')}
                </td>
                <td className="px-4 py-2 whitespace-normal">
                  {renderLocation(entry, 'timeOut')}
                </td>
                <td className="px-4 py-2 whitespace-normal">
                  {renderLocation(entry, 'travelHome')}
                </td>
                <td className="px-4 py-2">{entry.customerName}</td>
                <td className="px-4 py-2">{entry.workOrder}</td>
                <td className="px-4 py-2">{entry.address}</td>
                <td className="px-4 py-2">{entry.notes}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingEntry(entry)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimesheetApp;