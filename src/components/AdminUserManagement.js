// src/components/AdminUserManagement.js
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserPlus, Trash2, Edit2, Key } from 'lucide-react';
import WorkspaceSync from './admin/WorkspaceSync';

export default function AdminUserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newTempPassword, setNewTempPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    tempPassword: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      tempPassword: '',
      role: 'USER'
    });
    setEditingUser(null);
    setShowPasswordReset(false);
    setNewTempPassword('');
    setIsModalOpen(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!editingUser && !formData.email.trim()) return 'Email is required';
    if (!editingUser && !formData.tempPassword) return 'Temporary password is required';
    if (!editingUser && formData.tempPassword.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        const userDocRef = doc(db, 'users', editingUser.id);
        const updateData = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          role: formData.role,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.id || 'system'
        };

        if (showPasswordReset && newTempPassword) {
          if (newTempPassword.length < 6) {
            throw new Error('Password must be at least 6 characters');
          }
          updateData.forcePasswordChange = true;
          // Password reset would need to be handled through Firebase Auth
        }

        await updateDoc(userDocRef, updateData);
        setSuccess('User updated successfully');
        resetForm();
      } else {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.tempPassword
        );

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          role: formData.role,
          forcePasswordChange: true,
          createdAt: new Date().toISOString(),
          createdBy: user?.id || 'system',
          updatedAt: new Date().toISOString(),
          updatedBy: user?.id || 'system'
        });

        setSuccess('User created successfully');
        resetForm();
      }

      fetchUsers();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || 'USER',
    });
    setShowPasswordReset(false);
    setNewTempPassword('');
    setIsModalOpen(true);
    setError('');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Button 
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          {(error || success) && (
            <div className={`mb-4 p-4 rounded ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {error || success}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(user)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <Input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <Input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={editingUser}
                  className="mt-1"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Initial Password</label>
                  <Input
                    type="password"
                    required
                    value={formData.tempPassword}
                    onChange={(e) => setFormData({...formData, tempPassword: e.target.value})}
                    className="mt-1"
                    minLength="6"
                  />
                </div>
              )}

              {editingUser && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Password Reset</h3>
                    <Button
                      type="button"
                      onClick={() => setShowPasswordReset(!showPasswordReset)}
                      variant="outline"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      {showPasswordReset ? 'Cancel Password Reset' : 'Reset Password'}
                    </Button>
                  </div>

                  {showPasswordReset && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New Temporary Password
                      </label>
                      <Input
                        type="password"
                        value={newTempPassword}
                        onChange={(e) => setNewTempPassword(e.target.value)}
                        className="mt-1"
                        minLength="6"
                        required={showPasswordReset}
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="OFFICE">Office</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {editingUser ? 'Update' : 'Add'} User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <WorkspaceSync />
    </div>
  );
}