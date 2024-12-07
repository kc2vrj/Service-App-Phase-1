// pages/timesheet-daily.js
import { useAuth } from '../contexts/AuthContext';
import TimesheetApp from '../components/TimesheetApp';

export default function DailyView() {
  const { user } = useAuth();
  
  return <TimesheetApp user={user} />;
}