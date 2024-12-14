// src/hooks/useTimesheetOperations.js
import { useCallback } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTimesheet } from '../components/timesheet/TimesheetContext';

export const useTimesheetOperations = () => {
  const { dispatch } = useTimesheet();

  const addEntry = useCallback(async (formData) => {
    try {
      const docRef = await addDoc(collection(db, 'timesheet_entries'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      dispatch({ type: 'ADD_ENTRY', payload: { ...formData, id: docRef.id } });
      return docRef.id;
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  }, [dispatch]);

  const updateEntry = useCallback(async (id, formData) => {
    try {
      await updateDoc(doc(db, 'timesheet_entries', id), formData);
      dispatch({ type: 'UPDATE_ENTRY', payload: { ...formData, id } });
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  }, [dispatch]);

  const deleteEntry = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await deleteDoc(doc(db, 'timesheet_entries', id));
      dispatch({ type: 'DELETE_ENTRY', payload: id });
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }, [dispatch]);

  return { addEntry, updateEntry, deleteEntry };
};