import { useRef, useState } from "react";
import {
    Autocomplete,
    GoogleMap,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import MapProvider from "../components/MapProvider";
import "../styles/menu.css";

const containerStyle = {
    width: "100%",
    height: "calc(100vh - 220px)",
    minHeight: "350px",
    maxHeight: "500px",
};

interface Location {
    address: string;
    lat: number;
    lng: number;
}

export default function NearestBranch() {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [mapLocation, setMapLocation] = useState<Location | null>(null);
    const [showInfo, setShowInfo] = useState(false);


    // Khi click nút "Tìm"
    const handleSearch = () => {
        if (!selectedLocation) return;
        setMapLocation(selectedLocation);
    };

    return (
        <MapProvider>
            <div className="menuPage">
                <section
                    className="menuSection"
                    style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
                >
                    <div className="sectionHeader" style={{ marginBottom: "0.75rem" }}>
                        <h2
                            className="titleGreen"
                            style={{ fontSize: "1.5rem", marginBottom: "0" }}
                        >
                            Test Google API
                        </h2>
                    </div>

                    <div className="flex flex-col items-center max-w-4xl mx-auto px-4">
                        {/* INPUT & BUTTON */}
                        <div className="w-full max-w-xl flex items-center gap-2 mb-2">
                            <div className="flex-1">
                                <Autocomplete
                                    onLoad={(ac) => (autocompleteRef.current = ac)}
                                    onPlaceChanged={() => {
                                        const place = autocompleteRef.current?.getPlace();
                                        if (!place?.geometry?.location) return;

                                        setSelectedLocation({
                                            address: place.formatted_address || "",
                                            lat: place.geometry.location.lat(),
                                            lng: place.geometry.location.lng(),
                                        });
                                    }}
                                >
                                    <input
                                        placeholder="Nhập địa chỉ của bạn..."
                                        className="searchInput w-full"
                                        style={{
                                            padding: "0.5rem 0.75rem",
                                            fontSize: "0.875rem",
                                        }}
                                    />
                                </Autocomplete>
                            </div>

                            <button
                                onClick={handleSearch}
                                disabled={!selectedLocation}
                                className="btnGreen disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    padding: "0.5rem 1.5rem",
                                    fontSize: "0.875rem",
                                }}
                            >
                                Tìm
                            </button>
                        </div>

                        {/* MAP */}
                        {mapLocation ? (
                            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-green-100 mt-1">
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={{
                                        lat: mapLocation.lat,
                                        lng: mapLocation.lng,
                                    }}
                                    zoom={15}
                                >
                                    <Marker
                                        position={{
                                            lat: mapLocation.lat,
                                            lng: mapLocation.lng,
                                        }}
                                        onLoad={() => setShowInfo(true)} // marker xong → bật info
                                    />

                                    {showInfo && (
                                        <InfoWindow
                                            position={{
                                                lat: mapLocation.lat,
                                                lng: mapLocation.lng,
                                            }}
                                            onCloseClick={() => setShowInfo(false)}
                                        >
                                            <div className="text-xs px-2 py-1">
                                                <p className="font-semibold text-green-700 mb-0.5">
                                                    📍 Địa chỉ đã chọn
                                                </p>
                                                <p className="text-gray-500 leading-snug">
                                                    {mapLocation.address}
                                                </p>
                                            </div>

                                        </InfoWindow>
                                    )}
                                </GoogleMap>

                            </div>
                        ) : (
                            <div className="w-full max-w-xl text-center py-6 bg-gradient-to-br from-green-50 to-amber-50 rounded-xl border-2 border-green-100 mt-1">
                                <p className="text-gray-600 text-sm">
                                    Nhập địa chỉ của bạn
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </MapProvider>
    );
}
