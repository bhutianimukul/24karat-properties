"use client";

import { useRef, useEffect, useState } from "react";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
}

export function PropertyMap({ latitude, longitude, title, address }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    let cancelled = false;

    async function initMap() {
      const maplibregl = (await import("maplibre-gl")).default;
      // @ts-expect-error -- CSS import for maplibre styles
      await import("maplibre-gl/dist/maplibre-gl.css");

      if (cancelled || !mapContainer.current) return;

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center: [longitude, latitude],
        zoom: 14,
        pitch: 45,
        bearing: -17.6,
      });

      // Add navigation controls
      map.addControl(new maplibregl.NavigationControl(), "top-right");
      map.addControl(new maplibregl.FullscreenControl(), "top-left");

      // Gold marker
      const markerEl = document.createElement("div");
      markerEl.innerHTML = `
        <div style="
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #e8c875, #d4a853, #b8922e);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(212,168,83,0.4);
          display: flex; align-items: center; justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">🏠</span>
        </div>
      `;

      new maplibregl.Marker({ element: markerEl })
        .setLngLat([longitude, latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(
            `<div style="padding:4px 0"><strong style="color:#0a0a0f">${title}</strong><br/><span style="color:#666;font-size:12px">${address}</span></div>`
          )
        )
        .addTo(map);

      mapRef.current = map;
      setLoaded(true);
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, title, address]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-surface-border">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface">
          <div className="flex items-center gap-2 text-sm text-muted">
            <svg className="animate-spin h-4 w-4 text-gold" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading map...
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-[300px] sm:h-[400px]" />
    </div>
  );
}
