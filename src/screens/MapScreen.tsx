import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity
} from 'react-native';

import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import polyline from '@mapbox/polyline';

/* ------------------ TYPES ------------------ */

type Step = {
  distance: number;
  duration: number;
  start_location: LatLng;
  end_location: LatLng;
  instruction: string;
};

type PriorityPoint = LatLng & { id: string };

export default function MapScreen() {

  const GOOGLE_API_KEY = "AIzaSyAqT1P-o6kjwjxLI0AY3dVKz4MSAvHUpqU";

  const mapRef = useRef<MapView | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const firstFixDone = useRef<boolean>(false);

  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [defaultLine, setDefaultLine] = useState<LatLng[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [navStarted, setNavStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [navigationSteps, setNavigationSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [destinationAddress, setDestinationAddress] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  /* ------------------ DISTANCE HELPER ------------------ */

  const getDistance = (a: LatLng, b: LatLng) => {
    const dx = a.latitude - b.latitude;
    const dy = a.longitude - b.longitude;
    return Math.sqrt(dx * dx + dy * dy);
  };

  /* ------------------ SEARCH ------------------ */

  const searchPlaces = async (text: string) => {

    setSearchText(text);

    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {

      const url =
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.status === "OK") {
        setSuggestions(json.predictions);
      }

    } catch (e) {
      console.log(e);
    }
  };

  const selectPlace = async (placeId: string) => {

    try {

      const url =
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;

      const res = await fetch(url);
      const json = await res.json();

      const loc = json.result.geometry.location;

      const newLocation = {
        id: placeId,
        latitude: loc.lat,
        longitude: loc.lng
      };

      setDestination(newLocation);

      mapRef.current?.animateToRegion({
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      });

      setSuggestions([]);
      setSearchText(json.result.name);

    } catch (e) {
      console.log(e);
    }
  };

  /* ------------------ LOCATION ------------------ */

  useEffect(() => {

    const requestPermission = async () => {

      if (Platform.OS !== "android") return true;

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    };

    const getLocation = async () => {

      const permission = await requestPermission();
      if (!permission) return;

      Geolocation.getCurrentPosition(
        pos => {

          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };

          setCurrentLocation(loc);
          setDefaultLine(buildPriorityLine(loc));
          setLoading(false);

          if (!firstFixDone.current) {

            const coords = [loc, ...generatePoints(loc)];

            mapRef.current?.fitToCoordinates(coords, {
              edgePadding: { top: 120, bottom: 220, left: 60, right: 60 },
              animated: true
            });

            firstFixDone.current = true;
          }

        },
        err => console.log(err),
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 10000
        }
      );

      watchIdRef.current = Geolocation.watchPosition(
        pos => {

          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };

          setCurrentLocation(loc);
          setDefaultLine(buildPriorityLine(loc));

          if (navStarted && navigationSteps.length > 0) {

            const nextStepIndex = navigationSteps.findIndex(step => {
              const dist = getDistance(loc, step.start_location);
              return dist < 0.001;
            });

            if (nextStepIndex !== -1 && nextStepIndex !== currentStepIndex) {
              setCurrentStepIndex(nextStepIndex);
            }
          }

        },
        err => console.log(err),
        {
          enableHighAccuracy: true,
          distanceFilter: 5
        }
      );
    };

    getLocation();

    return () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };

  }, [navStarted, navigationSteps, currentStepIndex]);

  /* ------------------ ROUTE ------------------ */

  const fetchRoute = async (origin: LatLng, dest: LatLng) => {

    const url =
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${dest.latitude},${dest.longitude}&mode=driving&key=${GOOGLE_API_KEY}`;

    const res = await fetch(url);
    const json = await res.json();

    if (json.status !== "OK") return;

    const points = polyline.decode(json.routes[0].overview_polyline.points);

    const coords = points.map((p: number[]) => ({
      latitude: p[0],
      longitude: p[1]
    }));

    setRouteCoords(coords);

    const leg = json.routes[0].legs[0];

    setDistance(leg.distance.value / 1000);
    setDuration(Math.ceil(leg.duration.value / 60));

    const steps: Step[] = leg.steps.map((step: any) => ({
      distance: step.distance.value,
      duration: step.duration.value,
      start_location: {
        latitude: step.start_location.lat,
        longitude: step.start_location.lng
      },
      end_location: {
        latitude: step.end_location.lat,
        longitude: step.end_location.lng
      },
      instruction: step.html_instructions.replace(/<[^>]*>?/gm, '')
    }));

    setNavigationSteps(steps);

    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: { top: 100, bottom: 260, left: 60, right: 60 },
      animated: true
    });
  };

  /* ------------------ ADDRESS ------------------ */

  const getAddressFromLatLng = async (lat: number, lng: number) => {

    const url =
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;

    const res = await fetch(url);
    const json = await res.json();

    if (json.status === "OK") {

      const valid = json.results.find((r: any) =>
        !r.formatted_address.includes("+")
      );

      const result = valid || json.results[0];

      setDestinationAddress(result.formatted_address);
    }
  };

  /* ------------------ PRIORITY POINTS ------------------ */

  const generatePoints = (center: LatLng): PriorityPoint[] => [
    { id: "P1", latitude: center.latitude + 0.05, longitude: center.longitude },
    { id: "P2", latitude: center.latitude - 0.05, longitude: center.longitude },
    { id: "P3", latitude: center.latitude, longitude: center.longitude + 0.05 },
    { id: "P4", latitude: center.latitude, longitude: center.longitude - 0.05 }
  ];

  const buildPriorityLine = (center: LatLng): LatLng[] => {

    const points = generatePoints(center);
    const p1 = points.find(p => p.id === "P1")!;
    const others = points.filter(p => p.id !== "P1");

    others.sort((a, b) => getDistance(p1, a) - getDistance(p1, b));

    return [center, p1, ...others];
  };

  /* ------------------ NAVIGATION ------------------ */

  const startNavigation = () => {

    if (!destination || !currentLocation) return;

    setNavStarted(true);

    fetchRoute(currentLocation, destination);
    getAddressFromLatLng(destination.latitude, destination.longitude);
  };

  const stopNavigation = () => {

    setNavStarted(false);
    setRouteCoords([]);
    setDestination(null);
    setNavigationSteps([]);
  };

  if (loading || !currentLocation) {

    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ------------------ UI ------------------ */

  return (

    <View style={styles.container}>

      <View style={styles.searchContainer}>

        <TextInput
          placeholder="Search by area, name, street"
          value={searchText}
          onChangeText={searchPlaces}
          style={styles.searchInput}
          placeholderTextColor={'grey'}
        />

        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            style={styles.suggestionList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectPlace(item.place_id)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}

      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        }}
      >

        <Marker coordinate={currentLocation} title="You" />

        {destination && (
          <Marker coordinate={destination} pinColor="red" />
        )}

        {!navStarted && (
          <Polyline
            coordinates={defaultLine}
            strokeColor="blue"
            strokeWidth={3}
          />
        )}

        {navStarted && routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#1E90FF"
            strokeWidth={6}
          />
        )}

      </MapView>

      {destination && !navStarted && (
        <View style={styles.startWrapper}>
          <Text style={styles.startBtn} onPress={startNavigation}>
            Start Navigation
          </Text>
        </View>
      )}

      {navStarted && (
        <View style={styles.bottomPanel}>

          {destinationAddress && (
            <Text style={styles.addressText}>{destinationAddress}</Text>
          )}

          <Text style={styles.bigText}>{distance?.toFixed(2)} km</Text>
          <Text style={styles.smallText}>{duration} min</Text>

          <Text
            style={[styles.startBtn, { backgroundColor: "red" }]}
            onPress={stopNavigation}
          >
            Stop Navigation
          </Text>

        </View>
      )}

    </View>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({

  container: { flex: 1 },
  map: { flex: 1 },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  searchContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10
  },

  searchInput: {
    backgroundColor: "white",
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 4,
    color:'black'
  },

  suggestionList: {
    backgroundColor: "white",
    marginTop: 5,
    borderRadius: 10,
    maxHeight: 200
  },

  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },

  bottomPanel: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    elevation: 6,
    alignItems: "center"
  },

  startWrapper: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    alignItems: "center"
  },

  bigText: { fontSize: 22, fontWeight: "bold" },
  smallText: { fontSize: 14, color: "#666", marginBottom: 6 },

  startBtn: {
    backgroundColor: "#1E90FF",
    color: "white",
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10
  },

  addressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center"
  }

});