/**
 * TimesheetForm Component
 * A form for creating and editing timesheet entries with location tracking
 * 
 * @param {Object} initialData - Initial form data for editing existing entries
 * @param {Function} onSubmit - Callback function when form is submitted
 * @param {Function} onCancel - Callback function when form is cancelled
 */

import React, { useState } from 'react';
import { Plus, MapPin, Clock, X } from 'lucide-react';

const TimesheetForm = ({ initialData = {}, onSubmit, onCancel }) => {
  // Initialize form state with default values or provided data
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
    locations: {},
    addresses: {},
    ...initialData
  });
  const [locationStatus, setLocationStatus] = useState('');

  /**
   * Converts coordinates to address using OpenStreetMap API
   * @param {number} latitude - Location latitude
   * @param {number} longitude - Location longitude
   * @returns {Promise<string>} Address string
   */
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  };

  /**
   * Gets current time
   * @returns {string} Current time in HH:mm format
   */
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  /**
   * Updates form data with current time and location
   * @param {string} field - Name of time field being updated
   */
  const handleQuickTimeEntry = async (field) => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const currentTime = getCurrentTime();
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      // Get address for the location
      const address = await getAddressFromCoordinates(location.latitude, location.longitude);

      setFormData(prev => ({
        ...prev,
        [field]: currentTime,
        locations: {
          ...prev.locations,
          [field]: location
        },
        addresses: {
          ...prev.addresses,
          [field]: address
        }
      }));
      setLocationStatus('');
    } catch (error) {
      if (error.code === 1) {
        setLocationStatus('Location access denied. Please enable location services.');
      } else if (error.code === 2) {
        setLocationStatus('Location unavailable. Please try again.');
      } else {
        setLocationStatus('Error getting location. Please try again.');
      }
      console.error('Geolocation error:', error);
    }
  };

  /**
   * Updates form data when input fields change
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Validates and submits form data
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.customerName) return;
    await onSubmit(formData);
  };

  /**
   * Renders location information for a given field
   * @param {string} field - Name of time field
   * @returns {JSX.Element|null} Location information element or null
   */
  const renderLocationInfo = (field) => {
    if (formData.addresses?.[field]) {
      return (
        <div className="text-xs text-gray-500 mt-1">
          <MapPin className="w-3 h-3 inline mr-1" />
          {formData.addresses[field]}
          {formData.locations?.[field]?.accuracy && (
            <span className="ml-1">
              (±{Math.round(formData.locations[field].accuracy)}m)
            </span>
          )}
        </div>
      );
    }
    return null;
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

      {locationStatus && (
        <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md mb-4">
          {locationStatus}
        </div>
      )}

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
              {renderLocationInfo(field)}
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