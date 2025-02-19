"use client";

import React from "react";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string,
  // You can customize additional options here if needed
});

interface MarkerData {
  longitude: number;
  latitude: number;
  title?: string;
}

interface MapBoxMapProps {
  markers: MarkerData[];
  center: [number, number];
  zoom?: [number];
  className?: string;
}

const MapBoxMap = ({
  markers,
  center,
  zoom = [10],
  className,
}: MapBoxMapProps) => {
  return (
    <Mapbox
      style="mapbox://styles/mapbox/streets-v11"
      containerStyle={{ height: "100%", width: "100%" }}
      center={center}
      zoom={zoom}
      className={className}
    >
      {markers.map((marker, index) => (
        <Marker key={index} coordinates={[marker.longitude, marker.latitude]}>
          <div
            className="bg-red-500 rounded-full w-4 h-4"
            title={marker.title}
          />
        </Marker>
      ))}
    </Mapbox>
  );
};

export default MapBoxMap;
