import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

const { width } = Dimensions.get('window');
const ASPECT_RATIO = width / 200; // Adjust height based on width
const LATITUDE_DELTA = 0.005; // Zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  onLocationSelect,
}) => {
  const mapRef = useRef<MapView>(null);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onRegionChangeComplete={(e) => {
          onLocationSelect(e.latitude, e.longitude);
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={{ latitude, longitude }}
          draggable
          tracksViewChanges={false}
          onDragEnd={(e) => {
            const { latitude: newLat, longitude: newLng } =
              e.nativeEvent.coordinate;
            onLocationSelect(newLat, newLng);
          }}
        >
          <View style={styles.markerContainer}>
            <Ionicons name="location" size={40} color="#EF4444" />
            <View style={styles.markerShadow} />
          </View>
        </Marker>
      </MapView>
      <View style={styles.centerMarker}>
        <Ionicons name="location" size={40} color="#EF4444" />
      </View>
      {/* Overlay hint or controls could go here if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6', // Placeholder color while loading
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20, // half icon width
    marginTop: -40, // adjust to sit correctly
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerShadow: {
    width: 10,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 5,
    marginTop: -4,
  },
});
