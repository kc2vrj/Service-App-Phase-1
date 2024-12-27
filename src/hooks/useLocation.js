// hooks/useLocation.js
import { useState } from 'react';

export const useLocation = () => {
  const [locationError, setLocationError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      // Get current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      // Get address from coordinates using reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
      );
      const locationData = await response.json();

      return {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        address: locationData.display_name,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      setLocationError(error.message);
      throw error;
    } finally {
      setIsGettingLocation(false);
    }
  };

  return {
    getCurrentLocation,
    locationError,
    isGettingLocation
  };
};