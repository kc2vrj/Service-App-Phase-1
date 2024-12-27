// src/lib/types/roles.ts
export const UserRoles = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    DEVELOPER: 'DEVELOPER',
    SUPER_ADMIN: 'SUPER_ADMIN'
  } as const
  
  export type UserRole = keyof typeof UserRoles