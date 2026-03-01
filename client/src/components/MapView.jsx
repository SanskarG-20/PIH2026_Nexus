import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
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

/** Recenter map when user's real location arrives */
function RecenterMap({ userLocation }) {
    const map = useMap();
    const hasFlown = useRef(false);

    useEffect(() => {
        if (userLocation?.lat && userLocation?.lng && !hasFlown.current) {
            map.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.5 });
            hasFlown.current = true;
        }
    }, [userLocation?.lat, userLocation?.lng, map]);

    return null;
}

/** Fit map bounds when markers change */
function FitMarkers({ markers, userLocation, routeGeometry }) {
    const map = useMap();

    useEffect(() => {
        // If route geometry exists, fit to route bounds
        if (routeGeometry && routeGeometry.length > 1) {
            const bounds = L.latLngBounds(routeGeometry);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, duration: 1 });
            return;
        }

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
    }, [markers, userLocation, routeGeometry, map]);

    return null;
}

/**
 * MapView — Leaflet map with dark theme tiles.
 *
 * Props:
 *  - userLocation: { lat, lng }
 *  - markers: [{ name, lat, lng, description? }]
 *  - routeGeometry: [[lat, lng], ...] — polyline from route service
 *  - onMapReady: () => void
 */
// Mumbai fallback (MargDarshak is Mumbai-focused)
const MUMBAI_DEFAULT = { lat: 19.076, lng: 72.8777 };

export default function MapView({ userLocation, markers = [], routeGeometry = [], onMapReady }) {
    const center = userLocation || MUMBAI_DEFAULT;

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
                    height: "clamp(280px, 50vw, 400px)",
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

                    {/* Recenter when real user location arrives */}
                    <RecenterMap userLocation={userLocation} />

                    {/* Fit bounds when AI markers or route arrive */}
                    <FitMarkers markers={markers} userLocation={userLocation} routeGeometry={routeGeometry} />

                    {/* Route polyline */}
                    {routeGeometry.length > 1 && (
                        <Polyline
                            positions={routeGeometry}
                            pathOptions={{
                                color: Y,
                                weight: 3,
                                opacity: 0.8,
                                dashArray: "8, 6",
                            }}
                        />
                    )}

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
