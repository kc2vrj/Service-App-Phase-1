import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserPlus, Trash2, Edit2 } from 'lucide-react';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    tempPassword: '',
    userLevel: 'USER'
  });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        email: doc.data().email,
        role: doc.data().role
      }));
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
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
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        tempPassword: '',
        userLevel: 'USER'
      });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userLevel: user.role,
      id: user.id
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.userLevel
      });

      setSuccess('User updated successfully');
      setEditingUser(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        tempPassword: '',
        userLevel: 'USER'
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchUsers();
        setSuccess('User deleted successfully');
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="bg-[#1b1464] text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">User Management</h1>
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

          <form onSubmit={editingUser ? handleUpdate : handleSubmit} className="space-y-4">
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
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={editingUser}
                className="w-full px-3 py-2 border rounded-md focus:ring-[#1b1464] focus:border-[#1b1464]"
              />
            </div>

            {!editingUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Temporary Password</label>
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

            <button
              type="submit"
              className="w-full bg-[#ed1c24] text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {editingUser ? 'Update User' : 'Create User'}
            </button>

            {editingUser && (
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    tempPassword: '',
                    userLevel: 'USER'
                  });
                }}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel Edit
              </button>
            )}
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