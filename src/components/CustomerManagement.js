import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const CustomerManagement = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    siteNumber: '',
    address: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'customers'));
      const customersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(customersData);
    } catch (err) {
      setError('Failed to fetch customers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      if (editingCustomer) {
        await updateDoc(doc(db, 'customers', editingCustomer.id), {
          ...formData,
          updatedAt: new Date().toISOString(),
          updatedBy: user.id
        });
        setSuccessMessage('Customer updated successfully');
      } else {
        await addDoc(collection(db, 'customers'), {
          ...formData,
          createdAt: new Date().toISOString(),
          createdBy: user.id,
          updatedAt: new Date().toISOString()
        });
        setSuccessMessage('Customer added successfully');
      }

      resetForm();
      fetchCustomers();
    } catch (err) {
      setError('Error saving customer: ' + err.message);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      siteNumber: customer.siteNumber,
      address: customer.address,
      phone: customer.phone,
      email: customer.email,
    });
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await deleteDoc(doc(db, 'customers', customerId));
      setSuccessMessage('Customer deleted successfully');
      fetchCustomers();
    } catch (err) {
      setError('Error deleting customer: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      siteNumber: '',
      address: '',
      phone: '',
      email: '',
    });
    setEditingCustomer(null);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.siteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-md">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site #</label>
                <Input
                  required
                  value={formData.siteNumber}
                  onChange={(e) => setFormData({...formData, siteNumber: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone #</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {editingCustomer && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {editingCustomer ? 'Update' : 'Add'} Customer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Customer List</CardTitle>
            <div className="relative w-64">
              <Input
                type="search"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Customer Name</th>
                  <th className="text-left p-2">Site #</th>
                  <th className="text-left p-2">Address</th>
                  <th className="text-left p-2">Phone #</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b">
                    <td className="p-2">{customer.name}</td>
                    <td className="p-2">{customer.siteNumber}</td>
                    <td className="p-2">{customer.address}</td>
                    <td className="p-2">{customer.phone}</td>
                    <td className="p-2">{customer.email}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;