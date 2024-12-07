import WeeklyTimesheet from '../components/WeeklyTimesheet';
import { useAuth } from '../contexts/AuthContext';

export default function WeeklyView() {
  const { user } = useAuth();
  return <WeeklyTimesheet user={user} />;
}