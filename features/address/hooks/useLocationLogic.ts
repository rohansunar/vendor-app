import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface AddressDetails {
  city: string;
  state: string;
  pincode: string;
}

export const useLocationLogic = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);

  const requestPermissionAndGetCurrentLocation = useCallback(async () => {
    setLoading(true);
    setErrorMSG(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMSG('Permission to access location was denied');
        Alert.alert(
          "Location Permission Required",
          "Location is blocked. Please enable it from Settings to continue.",
          [
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        setLoading(false);
        return null;
      }

      let currentLocation = await Location.getLastKnownPositionAsync();

      if (!currentLocation) {
        currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }

      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });
      await reverseGeocode(latitude, longitude);

      return { latitude, longitude };
    } catch (error) {
      setErrorMSG('Failed to get current location');

      // Fallback to a default location (e.g., center of India or a major city) to allow map interaction
      // This prevents the UI from breaking or showing nothing
      const fallbackLocation = { latitude: 20.5937, longitude: 78.9629 };
      setLocation(fallbackLocation);

      Alert.alert(
        'Location Unavailable',
        'Could not fetch your exact location. Please use the map to pin your address.',
        [{
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
        { text: "Cancel", style: "cancel" }
      ]);

      setLoading(false);
      return fallbackLocation;
    }
  }, []);

  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);
      try {
        const result = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (result.length > 0) {
          const item = result[0];
          const newDetails: AddressDetails = {
            city: item.city || item.subregion || '',
            state: item.region || '',
            pincode: item.postalCode || ''
          };
          setAddressDetails(newDetails);
        }
      } catch (error) {
        console.error('[useLocationLogic] Reverse geocoding failed:', error);
        // We don't set a hard error here to allow manual entry, just log it
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    location,
    addressDetails,
    loading,
    errorMSG,
    requestPermissionAndGetCurrentLocation,
    reverseGeocode,
    setLocation,
  };
};
