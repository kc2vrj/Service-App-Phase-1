import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import TimesheetForm from './TimesheetForm';

const WeeklyTimesheet = ({ user }) => {
  const [currentWeek, setCurrentWeek] = useState(getWeekDates());
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [error, setError] = useState(null);

  function getWeekDates(date = new Date()) {
    // Create a new date object to avoid modifying the input
    const currentDate = new Date(date);
    // Get today's day of the week (0 = Sunday, 1 = Monday, etc.)
    const currentDay = currentDate.getDay();
    
    // Calculate the date of the most recent Sunday
    currentDate.setDate(currentDate.getDate() - currentDay);
    
    // Generate an array of dates for the week
    return Array(7).fill().map((_, i) => {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() + i);
      return day.toISOString().split('T')[0];
    });
  }

  useEffect(() => {
    if (!user) return;

    const fetchWeekEntries = async () => {
      try {
        const entriesRef = collection(db, 'timesheet_entries');
        const q = query(
          entriesRef,
          where('userId', '==', user.id)
        );

        const snapshot = await getDocs(q);
        let allEntries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter for current week's entries
        allEntries = allEntries
          .filter(entry => entry.date >= currentWeek[0] && entry.date <= currentWeek[6])
          .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date ascending

        setEntries(allEntries);
        setError(null);
      } catch (error) {
        console.error('Error fetching entries:', error);
        setError('Failed to load timesheet entries');
      }
    };

    fetchWeekEntries();
  }, [currentWeek[0], user]);

  const changeWeek = (direction) => {
    setCurrentWeek(prevWeek => {
      const firstDay = new Date(prevWeek[0]);
      firstDay.setDate(firstDay.getDate() + (direction === 'next' ? 7 : -7));
      return getWeekDates(firstDay);
    });
  };

  const renderLocation = (entry, field) => {
    if (!entry[field]) return '-';
    
    let locationDisplay = entry[field];
    let addressDisplay = null;

    // Check for address in both entry.addresses and entry.location structures
    if (entry.addresses?.[field]) {
      addressDisplay = entry.addresses[field];
    } else if (entry.location?.[field]) {
      // Show coordinates if no address is available
      const location = entry.location[field];
      addressDisplay = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
    }

    return (
      <div className="py-1">
        <div>{locationDisplay}</div>
        {addressDisplay && (
          <div className="text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3 inline mr-1" />
            {addressDisplay}
          </div>
        )}
      </div>
    );
  };

  // Rest of your component code remains the same...
  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 text-red-500">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <button
          onClick={() => changeWeek('prev')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-lg font-semibold">
          {new Date(currentWeek[0]).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          {' - '}
          {new Date(currentWeek[6]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>

        <button
          onClick={() => changeWeek('next')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Rest of your JSX remains the same... */}
    </div>
  );
};

export default WeeklyTimesheet;