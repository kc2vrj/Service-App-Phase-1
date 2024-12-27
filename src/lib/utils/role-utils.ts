// src/lib/utils/role-utils.ts
export const ROLE_HIERARCHY = {
    DEVELOPER: 4,
    ADMIN: 3,
    OFFICE: 2,
    USER: 1
  } as const
  
  export type RoleType = keyof typeof ROLE_HIERARCHY
  
  export function hasAccess(userRole: RoleType, requiredRole: RoleType): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
  }
  
  export function getRoleLevel(role: RoleType): number {
    return ROLE_HIERARCHY[role]
  }
  
  export function getAccessibleRoles(userRole: RoleType): RoleType[] {
    const userLevel = ROLE_HIERARCHY[userRole]
    return Object.entries(ROLE_HIERARCHY)
      .filter(([_, level]) => level <= userLevel)
      .map(([role]) => role as RoleType)
  }
  
  // Helper function to check if a role can manage other roles
  export function canManageRole(managerRole: RoleType, roleToManage: RoleType): boolean {
    return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[roleToManage]
  }