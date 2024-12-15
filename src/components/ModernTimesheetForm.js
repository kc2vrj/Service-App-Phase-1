import React, { useState } from 'react';
import { MapPin, Clock, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ModernTimesheetForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    travelStart: '',
    timeIn: '',
    timeOut: '',
    travelHome: '',
    customerName: '',
    workOrder: '',
    address: '',
    notes: '',
    location: {},
    addresses: {},
    ...initialData
  });

  const getCurrentTime = () => {
    return new Date().toTimeString().slice(0, 5);
  };

  const handleQuickTimeEntry = async (field) => {
    const currentTime = getCurrentTime();
    setFormData(prev => ({
      ...prev,
      [field]: currentTime
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.customerName) return;
    await onSubmit(formData);
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">
          {initialData.id ? 'Edit Timesheet Entry' : 'New Timesheet Entry'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: 'Travel Start', field: 'travelStart' },
                  { label: 'Time In', field: 'timeIn' },
                  { label: 'Time Out', field: 'timeOut' },
                  { label: 'Travel Home', field: 'travelHome' }
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickTimeEntry(field)}
                        className="flex items-center gap-1"
                      >
                        <Clock className="w-4 h-4" />
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">WO#/Job#</label>
                <Input
                  name="workOrder"
                  value={formData.workOrder}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {initialData.id ? 'Update' : 'Save'} Entry
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ModernTimesheetForm;