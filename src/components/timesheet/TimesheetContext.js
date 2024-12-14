// src/components/timesheet/TimesheetContext.js
import { createContext, useContext, useReducer } from 'react';

const TimesheetContext = createContext();

const timesheetReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload };
    case 'ADD_ENTRY':
      return { ...state, entries: [action.payload, ...state.entries] };
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry => 
          entry.id === action.payload.id ? action.payload : entry
        )
      };
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload)
      };
    default:
      return state;
  }
};

export const TimesheetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timesheetReducer, { entries: [] });
  return (
    <TimesheetContext.Provider value={{ state, dispatch }}>
      {children}
    </TimesheetContext.Provider>
  );
};

export const useTimesheet = () => useContext(TimesheetContext);