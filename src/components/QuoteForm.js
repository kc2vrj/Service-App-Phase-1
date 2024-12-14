import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Printer, Save, Plus, Trash2 } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const QuoteForm = ({ quoteId = null }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    quoteNumber: '',
    date: new Date().toISOString().split('T')[0],
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    items: [
      { partNumber: '', description: '', quantity: '', unitCost: '', totalCost: '0.00' }
    ],
    notes: '',
    subtotal: '0.00',
    tax: '0.00',
    total: '0.00',
    status: 'draft',
    createdBy: '',
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    if (quoteId) {
      loadQuote();
    }
  }, [quoteId]);

  const loadQuote = async () => {
    try {
      setLoading(true);
      const quoteDoc = await getDoc(doc(db, 'quotes', quoteId));
      if (quoteDoc.exists()) {
        setFormData(quoteDoc.data());
      }
    } catch (err) {
      setError('Error loading quote: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateLineTotal = (quantity, unitCost) => {
    const qty = parseFloat(quantity) || 0;
    const cost = parseFloat(unitCost) || 0;
    return (qty * cost).toFixed(2);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitCost') {
      newItems[index].totalCost = calculateLineTotal(
        field === 'quantity' ? value : newItems[index].quantity,
        field === 'unitCost' ? value : newItems[index].unitCost
      );
    }

    const subtotal = newItems.reduce((sum, item) => sum + parseFloat(item.totalCost || 0), 0);
    const tax = subtotal * 0.07; // 7% tax rate
    const total = subtotal + tax;

    setFormData({
      ...formData,
      items: newItems,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    });
  };

  const addRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { partNumber: '', description: '', quantity: '', unitCost: '', totalCost: '0.00' }]
    });
  };

  const removeRow = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        items: newItems
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      const quoteData = {
        ...formData,
        createdBy: user.id,
        updatedAt: new Date().toISOString(),
      };

      if (!quoteId) {
        // New quote
        quoteData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'quotes'), quoteData);
        setSuccessMessage('Quote created successfully');
      } else {
        // Update existing quote
        await updateDoc(doc(db, 'quotes', quoteId), quoteData);
        setSuccessMessage('Quote updated successfully');
      }
    } catch (err) {
      setError('Error saving quote: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Maytsch</CardTitle>
            <div className="space-x-2 print:hidden">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save Quote
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print Quote
              </Button>
            </div>
          </div>
          <div className="text-xl">Security & Fire Equipment Quote</div>
        </CardHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-600 p-4 mb-4">
            {successMessage}
          </div>
        )}

        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Quote #</label>
              <Input
                value={formData.quoteNumber}
                onChange={(e) => setFormData({...formData, quoteNumber: e.target.value})}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Person</label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full"
            />
          </div>

          <div className="mb-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Part #</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Qty</th>
                  <th className="text-left p-2">Unit Cost</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2 print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <Input
                        value={item.partNumber}
                        onChange={(e) => updateItem(index, 'partNumber', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitCost}
                        onChange={(e) => updateItem(index, 'unitCost', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      ${item.totalCost}
                    </td>
                    <td className="p-2 print:hidden">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeRow(index)}
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button onClick={addRow} className="mt-4 print:hidden">
              <Plus className="mr-2 h-4 w-4" />
              Add Row
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full"
              />
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="font-medium">Subtotal:</span> ${formData.subtotal}
              </div>
              <div className="mb-2">
                <span className="font-medium">Tax (7%):</span> ${formData.tax}
              </div>
              <div className="text-xl font-bold">
                <span>Total:</span> ${formData.total}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteForm;