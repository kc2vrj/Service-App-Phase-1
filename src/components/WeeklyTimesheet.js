import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit2, Check, MapPin } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import TimesheetForm from './TimesheetForm';

const WeeklyTimesheet = ({ user }) => {
  const [currentWeek, setCurrentWeek] = useState(getWeekDates());
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isWeekLocked, setIsWeekLocked] = useState(false);

  function getWeekDates(date = new Date()) {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    
    return Array(7).fill().map((_, i) => {
      const day = new Date(curr.setDate(first + i));
      return day.toISOString().split('T')[0];
    });
  }

  useEffect(() => {
    if (user) {
      fetchWeekEntries();
    }
  }, [currentWeek[0], user]);

  const fetchWeekEntries = async () => {
    try {
      const entriesRef = collection(db, 'timesheet_entries');
      const q = query(
        entriesRef,
        where('userId', '==', user.id),
        where('date', '>=', currentWeek[0]),
        where('date', '<=', currentWeek[6])
      );

      const weekStatusRef = doc(db, 'timesheet_weeks', currentWeek[0]);
      const weekStatus = await getDocs(weekStatusRef);
      setIsWeekLocked(weekStatus?.data()?.approved || false);

      const snapshot = await getDocs(q);
      const entriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(entriesData);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const renderLocationInfo = (entry, field) => {
    if (!entry.location?.[field]) return null;
    
    return (
      <div className="text-xs text-gray-500 mt-1">
        <MapPin className="w-3 h-3 inline mr-1" />
        {entry.location[field].latitude.toFixed(6)}, {entry.location[field].longitude.toFixed(6)}
      </div>
    );
  };

  // Rest of your existing functions (changeWeek, isCurrentOrFutureWeek, canEdit, approveWeek)...

  return (
    <div className="p-6">
      {/* Week navigation and controls - keep existing code */}
      
      <div className="grid grid-cols-7 gap-4">
        {currentWeek.map(date => (
          <div key={date} className="border rounded-lg">
            <div className="bg-gray-50 p-2 border-b">
              <div className="font-medium">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
            
            <div className="p-2 space-y-2">
              {entries
                .filter(entry => entry.date === date)
                .map(entry => (
                  <div key={entry.id} className="bg-white border rounded p-2 text-sm">
                    <div className="font-medium">{entry.customerName}</div>
                    <div className="text-gray-600">
                      {entry.timeIn && (
                        <div>
                          In: {entry.timeIn}
                          {renderLocationInfo(entry, 'timeIn')}
                        </div>
                      )}
                      {entry.timeOut && (
                        <div>
                          Out: {entry.timeOut}
                          {renderLocationInfo(entry, 'timeOut')}
                        </div>
                      )}
                      {entry.travelStart && (
                        <div>
                          Travel Start: {entry.travelStart}
                          {renderLocationInfo(entry, 'travelStart')}
                        </div>
                      )}
                      {entry.travelHome && (
                        <div>
                          Travel Home: {entry.travelHome}
                          {renderLocationInfo(entry, 'travelHome')}
                        </div>
                      )}
                    </div>
                    {canEdit() && (
                      <button
                        onClick={() => setEditingEntry(entry)}
                        className="mt-1 text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* EditingEntry modal - keep existing code */}
    </div>
  );
};

export default WeeklyTimesheet;