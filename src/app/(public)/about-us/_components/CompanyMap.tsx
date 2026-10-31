"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { INSTITUTE_NAME } from "@/constants";

const position: [number, number] = [7.3277, 13.5847];

export default function CompanyMap() {
  const companyIcon = useMemo(() => {
    return L.icon({
      iconUrl: "/images/location-marker.svg",
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40],
    });
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      className="h-full w-full rounded-xl z-40"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={companyIcon}>
        <Popup>
          <strong>{INSTITUTE_NAME}</strong>
          <br />
          Our location
        </Popup>
      </Marker>
    </MapContainer>
  );
}
