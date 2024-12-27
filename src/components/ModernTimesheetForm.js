// components/ModernTimesheetForm.js
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, Calendar, Building2, FileText, ClipboardEdit } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { useTheme } from '../hooks/useTheme';
import { cn } from '@/lib/utils';

const ModernTimesheetForm = ({ onSubmit, initialData = null, onCancel }) => {
  const { getCurrentLocation, isGettingLocation, locationError } = useLocation();
  const { theme, getColor, getBorderRadius, getShadow } = useTheme();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    workOrder: '',
    notes: '',
    travelStart: '',
    timeIn: '',
    timeOut: '',
    travelHome: '',
    addresses: {},
    ...(initialData || {})
  });
  const [error, setError] = useState('');

  const handleLocationClick = async (field) => {
    try {
      const locationData = await getCurrentLocation();
      
      setFormData(prev => ({
        ...prev,
        [field]: new Date().toLocaleTimeString(),
        addresses: {
          ...prev.addresses,
          [field]: locationData.address
        },
        [`${field}Coords`]: locationData.coords
      }));
    } catch (err) {
      setError(`Failed to get location: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          customerName: '',
          workOrder: '',
          notes: '',
          travelStart: '',
          timeIn: '',
          timeOut: '',
          travelHome: '',
          addresses: {}
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const renderLocationButton = (field, label, icon) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => handleLocationClick(field)}
            disabled={isGettingLocation}
            variant="outline"
            className={cn(
              "flex items-center gap-2 w-full sm:w-auto",
              "hover:bg-primary/10 transition-colors",
              "disabled:opacity-50"
            )}
            style={{
              '--primary-color': getColor('primary.main'),
              '--primary-hover': getColor('primary.light'),
              borderRadius: getBorderRadius('base')
            }}
          >
            {icon}
            <span className="hidden sm:inline">Record {label}</span>
            <span className="sm:hidden">Record</span>
          </Button>
          <Input
            value={formData[field]}
            readOnly
            placeholder="Time will appear here"
            className="w-32 text-center"
            style={{
              borderRadius: getBorderRadius('base'),
              borderColor: getColor('border.main')
            }}
          />
        </div>
        {formData.addresses?.[field] && (
          <div 
            className="text-sm flex items-center gap-1 p-2 rounded-md"
            style={{
              backgroundColor: getColor('background.paper'),
              color: getColor('text.secondary'),
              boxShadow: getShadow('sm'),
              borderRadius: getBorderRadius('base')
            }}
          >
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{formData.addresses[field]}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold" style={{ color: getColor('text.primary') }}>
          {initialData ? 'Edit Entry' : 'New Entry'}
        </CardTitle>
        <p style={{ color: getColor('text.secondary') }}>
          Record your work time and location
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div 
              className="p-4 rounded-md flex items-center gap-2"
              style={{
                backgroundColor: getColor('status.error') + '10',
                color: getColor('status.error'),
                borderRadius: getBorderRadius('base')
              }}
            >
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full"
                style={{
                  borderRadius: getBorderRadius('base'),
                  borderColor: getColor('border.main')
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">
                <Building2 className="w-4 h-4 inline mr-2" />
                Customer Name
              </Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
                className="w-full"
                style={{
                  borderRadius: getBorderRadius('base'),
                  borderColor: getColor('border.main')
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workOrder">
                <FileText className="w-4 h-4 inline mr-2" />
                Work Order
              </Label>
              <Input
                id="workOrder"
                value={formData.workOrder}
                onChange={(e) => setFormData({ ...formData, workOrder: e.target.value })}
                placeholder="Enter work order number"
                className="w-full"
                style={{
                  borderRadius: getBorderRadius('base'),
                  borderColor: getColor('border.main')
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                <ClipboardEdit className="w-4 h-4 inline mr-2" />
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter any additional notes"
                className="w-full"
                style={{
                  borderRadius: getBorderRadius('base'),
                  borderColor: getColor('border.main')
                }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {renderLocationButton('travelStart', 'Travel Start', <Clock className="w-4 h-4" />)}
            {renderLocationButton('timeIn', 'Time In', <Clock className="w-4 h-4" />)}
            {renderLocationButton('timeOut', 'Time Out', <Clock className="w-4 h-4" />)}
            {renderLocationButton('travelHome', 'Travel Home', <Clock className="w-4 h-4" />)}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-4 pt-6">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-gray-100"
            style={{
              borderRadius: getBorderRadius('base'),
              borderColor: getColor('border.main')
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          onClick={handleSubmit}
          className="hover:opacity-90"
          style={{
            backgroundColor: getColor('primary.main'),
            color: getColor('primary.contrastText'),
            borderRadius: getBorderRadius('base')
          }}
        >
          {initialData ? 'Update Entry' : 'Save Entry'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModernTimesheetForm;