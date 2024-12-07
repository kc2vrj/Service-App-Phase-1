import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserPlus, Trash2, Edit2, Key } from 'lucide-react';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newTempPassword, setNewTempPassword] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    tempPassword: '',
    userLevel: 'USER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      tempPassword: '',
      userLevel: 'USER'
    });
    setEditingUser(null);
    setShowPasswordReset(false);
    setNewTempPassword('');
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowPasswordReset(false);
    setNewTempPassword('');
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      userLevel: user.role || 'USER',
      id: user.id
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        // Update user data
        const userDocRef = doc(db, 'users', editingUser.id);
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.userLevel,
          updatedAt: new Date().toISOString()
        };

        if (showPasswordReset && newTempPassword) {
          updateData.forcePasswordChange = true;
          // Note: Actual password update would need to be handled by a backend service
          console.log('Password reset requested:', newTempPassword);
        }

        await updateDoc(userDocRef, updateData);
        setSuccess('User updated successfully');
        resetForm();
      } else {
        // Create new user
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.tempPassword
        );

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.userLevel,
          forcePasswordChange: true,
          createdAt: new Date().toISOString()
        });

        setSuccess('User created successfully');
        resetForm();
      }

      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setSuccess('User deleted successfully');
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="bg-[#1b1464] text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">
            {editingUser ? 'Edit User' : 'Create New User'}
          </h1>
        </div>

        <div className="bg-white shadow-lg rounded-b-lg p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:ring-[#1b1464] focus:border-[#1b1464]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:ring-[#1b1464] focus:border-[#1b1464]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required={!editingUser}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={editingUser}
                className="w-full px-3 py-2 border rounded-md focus:ring-[#1b1464] focus:border-[#1b1464]"
              />
            </div>

            {!editingUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Password</label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.tempPassword}
                  onChange={(e) => setFormData({...formData, tempPassword: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:ring-[#1b1464] focus:border-[#1b1464]"
                  minLength="6"
                />
              </div>
            )}

            {editingUser && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Password Reset</h3>
                  <button
                    type="button"
                    onClick={() => setShowPasswordReset(!showPasswordReset)}
                    className="flex items-center gap-2 text-[#1b1464] hover:text-blue-700"
                  >
                    <Key className="w-4 h-4" />
                    {showPasswordReset ? 'Cancel Password Reset' : 'Reset Password'}
                  </button>
                </div>

                {showPasswordReset && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Temporary Password
                    </label>
                    <input
                      type="password"
                      value={newTempPassword}
                      onChange={(e) => setNewTempPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-[#1b1464] focus:border-[#1b1464]"
                      minLength="6"
                      required={showPasswordReset}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      User will be required to change this password at next login
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">User Level</label>
              <select
                value={formData.userLevel}
                onChange={(e) => setFormData({...formData, userLevel: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:ring-[#1b1464] focus:border-[#1b1464]"
              >
                <option value="USER">USER</option>
                <option value="OFFICE">OFFICE</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#ed1c24] text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {editingUser ? 'Update User' : 'Create User'}
              </button>

              {editingUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="bg-[#1b1464] text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-bold">Manage Users</h2>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-[#1b1464] hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-[#ed1c24] hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}