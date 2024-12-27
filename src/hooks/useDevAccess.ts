 // src/hooks/useDevAccess.ts
 import { useAuth } from '@/contexts/AuthContext'
  
 export function useDevAccess() {
   const { user } = useAuth()
   const isDeveloper = user?.role === 'DEVELOPER' || user?.role === 'SUPER_ADMIN'
   
   return {
     isDeveloper,
     isAuthenticated: !!user,
     user
   }
 }