// src/components/users/UserForm.tsx
const roleOptions = [
  { label: 'User', value: 'USER' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Developer', value: 'DEVELOPER' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' }
]

// Only show developer/super admin options to existing developers
const availableRoles = isDeveloper ? roleOptions : roleOptions.slice(0, 2)
