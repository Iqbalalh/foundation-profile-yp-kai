"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Icon } from "leaflet";
import Image from "next/image";
import { DummyMarkers } from "@/lib/dummy-marker";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { FilterDropdown } from "./filter-dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchIcon } from "lucide-react";

const Adelaide = {
  url: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg",
  attribution:
    '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// const OpenMap = {
//   url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// };

// const BlackMap = {
//   url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
//   attribution:
//     '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// };

const TileLayerData = {
  url: Adelaide.url,
  attribution: Adelaide.attribution,
  minZoom: 0,
  maxZoom: 20,
};

const markerIcon = new Icon({
  iconUrl: "/img/location-icon.png",
  iconSize: [50, 50],
});

const userIcon = new Icon({
  iconUrl: "/img/user-icon.png",
  iconSize: [50, 50],
});

export default function CustomMap({ setIsOpen }) {

  const [userCoordinates, setUserCoordinates] = useState([-5.396854, 105.208756]);
  const [zoom] = useState(15);
  const [followUser, setFollowUser] = useState(true);
  const isMobile = useIsMobile();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          setUserCoordinates([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, []);

  return (
    <MapContainer
      center={userCoordinates}
      zoom={zoom}
      scrollWheelZoom={true}
      zoomControl={false}
      className="w-full h-full"
    >
      <FollowUserController
        userCoordinates={userCoordinates}
        followUser={followUser}
      />

      <div className="z-[5000] w-full absolute bg-white p-2 shadow">
        <div className="flex space-x-2">
          <div className="flex w-full max-w-sm items-center gap-1">
            <Input type="email" placeholder="Email" />
            <Button type="submit" variant="outline">
              <SearchIcon />
            </Button>
          </div>
          <div>
            <FilterDropdown />
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={followUser} onCheckedChange={setFollowUser} />
            {!isMobile && (
              <span className="text-sm">{followUser ? "Center" : "Free"}</span>
            )}
          </div>
        </div>
      </div>

      <Marker icon={userIcon} position={userCoordinates}>
        <Popup>Ini Saya</Popup>
      </Marker>

      {DummyMarkers.map((marker) => (
        <Marker
          icon={markerIcon}
          position={marker.geocode}
          key={marker.id}
          eventHandlers={{
            // click: () => setIsOpen?.(true),
          }}
        >
          <Popup>
            <div className="space-y-2">
              <Image
                width={80}
                height={80}
                src={marker.data.profile}
                alt={marker.data.name}
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
              <h3 className="font-bold text-lg text-center">
                {marker.data.name}
              </h3>
              <p className="text-sm text-gray-700">
                <strong>Alamat:</strong> {marker.data.address}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Anak:</strong> {marker.data.childs}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Umur:</strong> {marker.data.age} tahun
              </p>
              <Button variant="outline" className="w-full">
                Detail
              </Button>
              <div className="flex space-x-2 items-center justify-center">
                <div className="w-1/2">
                  <RouteButton
                    userCoordinates={userCoordinates}
                    destination={marker.geocode}
                    routingControlRef={routingControlRef}
                  />
                </div>
                <div className="w-1/2">
                  <GMapsButton
                    userCoordinates={userCoordinates}
                    destination={marker.geocode}
                    routingControlRef={routingControlRef}
                  />
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <TileLayer
        url={TileLayerData.url}
        attribution={TileLayerData.attribution}
        minZoom={TileLayerData.minZoom}
        maxZoom={TileLayerData.maxZoom}
      />
    </MapContainer>
  );
}

function FollowUserController({ userCoordinates, followUser }) {
  const map = useMap();

  useEffect(() => {
    if (followUser) {
      map.setView(userCoordinates);
    }
  }, [userCoordinates, followUser, map]);

  return null;
}

function setRoute(map, userCoordinates, destination, routingControlRef) {
  if (routingControlRef.current) {
    map.removeControl(routingControlRef.current);
  }

  routingControlRef.current = L.Routing.control({
    waypoints: [
      L.latLng(userCoordinates[0], userCoordinates[1]),
      L.latLng(destination[0], destination[1]),
    ],
    routeWhileDragging: false,
    show: false,
  }).addTo(map);
}

function RouteButton({ userCoordinates, destination, routingControlRef }) {
  const map = useMap();

  useEffect(() => {
    import("leaflet-routing-machine");
  }, []);

  return (
    <Button
      className="w-full"
      onClick={() =>
        setRoute(map, userCoordinates, destination, routingControlRef)
      }
    >
      Navigasi
    </Button>
  );
}

function GMapsButton({ userCoordinates, destination, routingControlRef }) {
  const map = useMap();

  useEffect(() => {
    import("leaflet-routing-machine");
  }, []);

  const handleClick = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoordinates[0]},${userCoordinates[1]}&destination=${destination}&travelmode=driving`;
    window.open(url, "_blank");
    setRoute(map, userCoordinates, destination, routingControlRef);
  };

  return (
    <Button className="w-full" onClick={handleClick}>
      GMaps
    </Button>
  );
}
