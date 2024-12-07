import React, { useState } from 'react';
import { Plus, MapPin, Clock, X } from 'lucide-react';

const TimesheetForm = ({ initialData = {}, onSubmit, onCancel }) => {
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
  const [locationStatus, setLocationStatus] = useState('');

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const handleQuickTimeEntry = async (field) => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const currentTime = getCurrentTime();
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      // Get address for the location
      const address = await getAddressFromCoordinates(location.latitude, location.longitude);

      setFormData(prev => ({
        ...prev,
        [field]: currentTime,
        location: {
          ...prev.location,
          [field]: location
        },
        addresses: {
          ...prev.addresses,
          [field]: address
        }
      }));
      setLocationStatus('');
    } catch (error) {
      setLocationStatus('Location access denied');
      console.error('Geolocation error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.customerName) return;
    await onSubmit(formData);
    if (!initialData.id) {
      setFormData({
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
        addresses: {}
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{initialData.id ? 'Edit Entry' : 'New Entry'}</h2>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {['travelStart', 'timeIn', 'timeOut', 'travelHome'].map(field => (
            <div key={field} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleQuickTimeEntry(field)}
                  className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-1"
                  title="Mark current time with location"
                >
                  <Clock className="w-4 h-4" />
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
              {formData.addresses?.[field] && (
                <div className="text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {formData.addresses[field]}
                </div>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WO#/Job#
            </label>
            <input
              type="text"
              name="workOrder"
              value={formData.workOrder}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {locationStatus && (
          <div className="text-sm text-yellow-600">
            {locationStatus}
          </div>
        )}

        <div className="flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {initialData.id ? 'Update' : 'Add'} Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimesheetForm;