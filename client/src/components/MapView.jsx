import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Y, BK, WH } from "../constants/theme";

// Fix default marker icons (Leaflet + bundler issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom yellow marker for user location
const userIcon = new L.DivIcon({
    className: "",
    html: `<div style="
        width:16px;height:16px;border-radius:50%;
        background:${Y};border:3px solid ${BK};
        box-shadow:0 0 12px ${Y},0 0 24px rgba(204,255,0,.3);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

// Custom marker for AI-recommended places
const placeIcon = new L.DivIcon({
    className: "",
    html: `<div style="
        width:12px;height:12px;border-radius:50%;
        background:#fff;border:2px solid ${Y};
        box-shadow:0 0 8px rgba(204,255,0,.4);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

/** Recenter map when location changes */
function RecenterMap({ lat, lng }) {
    const map = useMap();
    const hasFlown = useRef(false);

    useEffect(() => {
        if (lat && lng && !hasFlown.current) {
            map.flyTo([lat, lng], 13, { duration: 1.5 });
            hasFlown.current = true;
        }
    }, [lat, lng, map]);

    return null;
}

/** Fit map bounds when markers change */
function FitMarkers({ markers, userLocation }) {
    const map = useMap();

    useEffect(() => {
        if (!markers || markers.length === 0) return;

        const points = markers
            .filter((m) => m.lat && m.lng)
            .map((m) => [m.lat, m.lng]);

        if (userLocation) {
            points.push([userLocation.lat, userLocation.lng]);
        }

        if (points.length > 1) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, duration: 1 });
        }
    }, [markers, userLocation, map]);

    return null;
}

/**
 * MapView — Leaflet map with dark theme tiles.
 *
 * Props:
 *  - userLocation: { lat, lng }
 *  - markers: [{ name, lat, lng, description? }]
 *  - onMapReady: () => void
 */
export default function MapView({ userLocation, markers = [], onMapReady }) {
    const center = userLocation || { lat: 28.6139, lng: 77.209 };

    return (
        <div style={{ marginTop: 32 }}>
            {/* Header */}
            <div
                style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 22,
                    color: Y,
                    letterSpacing: 2,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <span
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#22c55e",
                        display: "inline-block",
                        boxShadow: "0 0 8px #22c55e",
                        animation: "pulse-ring 2s ease infinite",
                    }}
                />
                LIVE MAP
            </div>

            {/* Map container */}
            <div
                style={{
                    border: `1px solid rgba(255,255,255,.08)`,
                    height: 400,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <MapContainer
                    center={[center.lat, center.lng]}
                    zoom={12}
                    style={{ height: "100%", width: "100%", background: BK }}
                    zoomControl={true}
                    whenReady={() => onMapReady?.()}
                >
                    {/* Dark theme tiles — CartoDB Dark Matter */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {/* Recenter on user location */}
                    <RecenterMap lat={center.lat} lng={center.lng} />

                    {/* Fit bounds when AI markers arrive */}
                    <FitMarkers markers={markers} userLocation={userLocation} />

                    {/* User location marker */}
                    {userLocation && (
                        <Marker
                            position={[userLocation.lat, userLocation.lng]}
                            icon={userIcon}
                        >
                            <Popup>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                                    <strong>Your Location</strong>
                                    <br />
                                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* AI recommended place markers */}
                    {markers
                        .filter((m) => m.lat && m.lng)
                        .map((marker, i) => (
                            <Marker
                                key={`${marker.name}-${i}`}
                                position={[marker.lat, marker.lng]}
                                icon={placeIcon}
                            >
                                <Popup>
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, maxWidth: 200 }}>
                                        <strong>{marker.name}</strong>
                                        {marker.description && (
                                            <div style={{ marginTop: 4, color: "#666", fontSize: 12 }}>
                                                {marker.description}
                                            </div>
                                        )}
                                        {marker.estimatedCost && (
                                            <div style={{ marginTop: 4, fontWeight: 600, color: "#333" }}>
                                                {marker.estimatedCost}
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                </MapContainer>

                {/* Overlay border accent */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "30%",
                        height: 3,
                        background: Y,
                        zIndex: 1000,
                        pointerEvents: "none",
                    }}
                />
            </div>
        </div>
    );
}
