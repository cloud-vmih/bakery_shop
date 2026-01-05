import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import MapProvider from "../components/MapProvider";
import AddressAutocomplete, {
  AddressResult,
} from "../components/AddressAutocomplete";
import { getBranches, Branch } from "../services/branch.services";
import "../styles/menu.css";
import { getDistanceKm } from "../utils/distance";

/* ================== CONSTANT ================== */

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 220px)",
  minHeight: "350px",
  maxHeight: "500px",
};

const DEFAULT_CENTER = {
  lat: 10.7769, // TP.HCM (đổi nếu cần)
  lng: 106.7009,
};

const ITEMS_PER_PAGE = 6;

/* ================== TYPES ================== */

type BranchWithDistance = Branch & {
  distance: number;
};

/* ================== COMPONENT ================== */

export default function NearestBranch() {
  const mapRef = useRef<google.maps.Map | null>(null);

  /* ================== STATE ================== */
  const [branches, setBranches] = useState<Branch[]>([]);
  const [nearbyBranches, setNearbyBranches] =
    useState<BranchWithDistance[]>([]);

  const [selectedLocation, setSelectedLocation] =
    useState<AddressResult | null>(null);

  const [mapLocation, setMapLocation] =
    useState<AddressResult | null>(null);

  const [selectedBranch, setSelectedBranch] =
    useState<BranchWithDistance | null>(null);

  const [showUserInfo, setShowUserInfo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* ================== LOAD BRANCHES ================== */
  useEffect(() => {
    getBranches()
      .then(setBranches)
      .catch(console.error);
  }, []);

  /* ================== SEARCH ================== */
  const handleSearch = () => {
    if (!selectedLocation) return;

    setMapLocation(selectedLocation);
    setShowUserInfo(true);

    const nearby = branches
      .map(branch => ({
        ...branch,
        distance: getDistanceKm(
          selectedLocation.lat,
          selectedLocation.lng,
          branch.lat,
          branch.lng
        ),
      }))
      .filter(b => b.distance <= 5)
      .sort((a, b) => a.distance - b.distance);

    setNearbyBranches(nearby);

    // highlight chi nhánh gần nhất
    if (nearby.length > 0) {
      setSelectedBranch(nearby[0]);
      panToLocation(nearby[0].lat, nearby[0].lng);
    }
  };

  /* ================== PAN MAP ================== */
  const panToLocation = (lat: number, lng: number) => {
    if (!mapRef.current) return;
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  };

  /* ================== OPEN GOOGLE MAPS ================== */
  const openGoogleMaps = (branch: Branch) => {
    if (!mapLocation) return;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${mapLocation.lat},${mapLocation.lng}&destination=${branch.lat},${branch.lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  /* ================== PAGINATION ================== */
  const totalPages = Math.ceil(branches.length / ITEMS_PER_PAGE);
  const paginatedBranches = branches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================== RENDER ================== */

  return (
    <MapProvider>
      <div className="menuPage">
        <section className="menuSection pt-2 pb-2">
          <div className="sectionHeader mb-3">
            <h2 className="titleGreen text-2xl mb-0">
              Tìm chi nhánh gần nhất
            </h2>
          </div>

          <div className="flex flex-col items-center max-w-5xl mx-auto px-4">

            {/* SEARCH */}
            <div className="w-full max-w-xl flex gap-2 mb-4">
              <div className="flex-1">
                <AddressAutocomplete
                  placeholder="Nhập địa chỉ của bạn..."
                  onSelect={setSelectedLocation}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!selectedLocation}
                className="btnGreen disabled:opacity-50"
              >
                Tìm
              </button>
            </div>

            {/* MAP + NEARBY */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

              {/* MAP */}
              <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-xl border">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={
                    mapLocation
                      ? { lat: mapLocation.lat, lng: mapLocation.lng }
                      : DEFAULT_CENTER
                  }
                  zoom={mapLocation ? 14 : 11}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                >
                  {/* USER MARKER */}
                  {mapLocation && (
                    <Marker
                      position={{
                        lat: mapLocation.lat,
                        lng: mapLocation.lng,
                      }}
                    />
                  )}

                  {/* BRANCH MARKERS */}
                  {branches.map(branch => {
                    const isNearby = nearbyBranches.some(
                      b => b.id === branch.id
                    );
                    const isSelected = selectedBranch?.id === branch.id;

                    return (
                      <Marker
                        key={branch.id}
                        position={{ lat: branch.lat, lng: branch.lng }}
                        icon={
                          isSelected
                            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            : isNearby
                            ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        }
                        onClick={() => {
                          if (!mapLocation) return;
                          const distance = getDistanceKm(
                            mapLocation.lat,
                            mapLocation.lng,
                            branch.lat,
                            branch.lng
                          );
                          setSelectedBranch({ ...branch, distance });
                          panToLocation(branch.lat, branch.lng);
                        }}
                      />
                    );
                  })}

                  {/* USER INFO */}
                  {mapLocation && showUserInfo && (
                    <InfoWindow
                      position={{
                        lat: mapLocation.lat,
                        lng: mapLocation.lng,
                      }}
                      onCloseClick={() => setShowUserInfo(false)}
                    >
                      <div className="text-xs">
                        <p className="font-semibold text-green-700">
                          📍 Vị trí của bạn
                        </p>
                        <p>{mapLocation.fullAddress}</p>
                      </div>
                    </InfoWindow>
                  )}

                  {/* BRANCH INFO */}
                  {selectedBranch && (
                    <InfoWindow
                      position={{
                        lat: selectedBranch.lat,
                        lng: selectedBranch.lng,
                      }}
                      onCloseClick={() => setSelectedBranch(null)}
                    >
                      <div className="text-xs">
                        <p className="font-semibold text-cyan-700">
                          🏪 {selectedBranch.name}
                        </p>
                        <p>{selectedBranch.address}</p>
                        <p className="text-green-700">
                          📏 {selectedBranch.distance.toFixed(2)} km
                        </p>
                        {mapLocation && (
                          <button
                            className="text-blue-600 text-xs mt-1"
                            onClick={() => openGoogleMaps(selectedBranch)}
                          >
                            ➤ Chỉ đường
                          </button>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </div>

              {/* NEARBY LIST */}
              <div className="bg-white rounded-2xl border shadow-md p-4 max-h-[500px] overflow-y-auto">
                <h4 className="font-semibold text-green-700 mb-3">
                  Chi nhánh ≤ 5km
                </h4>

                {nearbyBranches.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Không có chi nhánh gần
                  </p>
                )}

                {nearbyBranches.map(branch => (
                  <div
                    key={branch.id}
                    className="border rounded-xl p-3 mb-3 hover:bg-green-50 cursor-pointer"
                    onClick={() => {
                      setSelectedBranch(branch);
                      panToLocation(branch.lat, branch.lng);
                    }}
                  >
                    <p className="font-semibold text-sm">
                      🏪 {branch.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      📍 {branch.address}
                    </p>
                    <p className="text-xs text-green-700">
                      📏 {branch.distance.toFixed(2)} km
                    </p>
                    <button
                      className="text-blue-600 text-xs mt-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openGoogleMaps(branch);
                      }}
                    >
                      ➤ Chỉ đường
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ALL BRANCH LIST + PAGINATION */}
            <div className="w-full">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Danh sách chi nhánh
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedBranches.map(branch => (
                  <div
                    key={branch.id}
                    className="border rounded-2xl p-6 shadow-md hover:shadow-xl cursor-pointer bg-white"
                    onClick={() => {
                      if (!mapLocation) return;
                      const distance = getDistanceKm(
                        mapLocation.lat,
                        mapLocation.lng,
                        branch.lat,
                        branch.lng
                      );
                      setSelectedBranch({ ...branch, distance });
                      panToLocation(branch.lat, branch.lng);
                    }}
                  >
                    <h4 className="text-lg font-bold text-cyan-700 mb-2">
                      🏪 {branch.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      📍 {branch.address}
                    </p>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === i + 1
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-600 hover:bg-green-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>
      </div>
    </MapProvider>
  );
}