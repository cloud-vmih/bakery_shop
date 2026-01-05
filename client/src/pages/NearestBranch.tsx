import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import MapProvider from "../components/MapProvider";
import AddressAutocomplete, {
  AddressResult,
} from "../components/AddressAutocomplete";
import { getBranches, Branch } from "../services/branch.services";
import { getDistanceKm } from "../utils/distance";

import {
  MapPinIcon,
  BuildingStorefrontIcon,
  ArrowTopRightOnSquareIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

/* ================== CONSTANT ================== */

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 220px)",
  minHeight: "400px",
  maxHeight: "600px",
};

const DEFAULT_CENTER = {
  lat: 10.7769,
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

  const [branches, setBranches] = useState<Branch[]>([]);
  const [nearbyBranches, setNearbyBranches] = useState<BranchWithDistance[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<AddressResult | null>(null);
  const [mapLocation, setMapLocation] = useState<AddressResult | null>(null);

  const [selectedBranch, setSelectedBranch] = useState<BranchWithDistance | null>(null);
  type InfoWindowType = "USER" | "BRANCH" | null;
  const [infoWindowType, setInfoWindowType] = useState<InfoWindowType>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getBranches()
      .then(setBranches)
      .catch(console.error);
  }, []);

  const handleSearch = () => {
    if (!selectedLocation) return;

    setMapLocation(selectedLocation);
    setInfoWindowType("USER");

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

    if (nearby.length > 0) {
      setSelectedBranch(nearby[0]);
      setInfoWindowType("BRANCH");

      panToLocation(nearby[0].lat, nearby[0].lng);
    } else {
      setSelectedBranch(null);
    }
  };

  const panToLocation = (lat: number, lng: number) => {
    if (!mapRef.current) return;
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  };

  const openGoogleMaps = (branch: Branch) => {
    if (!mapLocation) return;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${mapLocation.lat},${mapLocation.lng}&destination=${branch.lat},${branch.lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const totalPages = Math.ceil(branches.length / ITEMS_PER_PAGE);
  const paginatedBranches = branches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <MapProvider>
      <div className="min-h-screen bg-green-50 py-8 px-4 font-['Plus_Jakarta_Sans']">
        <section className="max-w-6xl mx-auto">
          {/* Tiêu đề chính - thu nhỏ */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-3">
              Tìm chi nhánh gần nhất
            </h1>
            <p className="text-base text-amber-800 font-medium">
              Nhập địa chỉ của bạn để xem chi nhánh gần nhất và chỉ đường nhanh chóng
            </p>
          </div>

          {/* Thanh tìm kiếm */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex gap-3">
              <div className="flex-1">
                <AddressAutocomplete
                  placeholder="Nhập địa chỉ của bạn..."
                  onSelect={setSelectedLocation}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!selectedLocation}
                className="px-6 py-1 min-w-fit bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-base rounded-xl shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap"
              >
                Tìm
              </button>
            </div>
          </div>

          {/* Bản đồ + Danh sách chi nhánh gần */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Bản đồ */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
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
                {mapLocation && (
                  <Marker
                    position={{ lat: mapLocation.lat, lng: mapLocation.lng }}
                    icon="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                  />
                )}

                {branches.map(branch => {
                  const isNearby = nearbyBranches.some(b => b.id === branch.id);
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
                        setInfoWindowType("BRANCH");
                        panToLocation(branch.lat, branch.lng);
                      }}
                    />
                  );
                })}

                {infoWindowType === "USER" && mapLocation && (
                  <InfoWindow
                    position={{ lat: mapLocation.lat, lng: mapLocation.lng }}
                    onCloseClick={() => setInfoWindowType(null)}
                  >
                    <div className="p-3">
                      <div className="flex items-start gap-2">
                        <MapPinIcon className="w-5 h-5 text-green-800 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-green-800">Vị trí của bạn</p>
                          <p className="text-xs text-gray-700 mt-1">
                            {mapLocation.fullAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}

                {infoWindowType === "BRANCH" && selectedBranch && (
                  <InfoWindow
                    position={{ lat: selectedBranch.lat, lng: selectedBranch.lng }}
                    onCloseClick={() => {
                      setSelectedBranch(null);
                      setInfoWindowType("USER");
                    }}
                  >
                    <div className="p-4 min-w-[240px]">
                      <div className="flex items-start gap-2 mb-2">
                        <BuildingStorefrontIcon className="w-6 h-6 text-green-800 flex-shrink-0" />
                        <p className="text-lg font-bold text-green-800">
                          {selectedBranch.name}
                        </p>
                      </div>

                      <p className="text-sm text-gray-700 ml-8 mb-3">
                        {selectedBranch.address}
                      </p>

                      <p className="flex items-center gap-2 text-green-700 font-semibold ml-8 mb-3">
                        <TruckIcon className="w-5 h-5" />
                        {selectedBranch.distance.toFixed(2)} km
                      </p>

                      <button
                        onClick={() => openGoogleMaps(selectedBranch)}
                        className="flex items-center gap-1.5 ml-8 text-amber-800 text-sm font-medium hover:underline"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        Chỉ đường bằng Google Maps
                      </button>
                    </div>
                  </InfoWindow>
                )}


              </GoogleMap>
            </div>

            {/* Danh sách chi nhánh gần (≤ 5km) */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 max-h-[500px] overflow-y-auto">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Chi nhánh gần bạn (≤ 5km)
              </h3>

              {!mapLocation && (
                <p className="text-center text-gray-500 italic py-8 text-sm">
                  Vui lòng nhập địa chỉ để tìm chi nhánh gần nhất
                </p>
              )}

              {mapLocation && nearbyBranches.length === 0 && (
                <p className="text-center text-gray-500 italic py-8 text-sm">
                  Không có chi nhánh nào trong bán kính 5km
                </p>
              )}

              {nearbyBranches.map(branch => (
                <div
                  key={branch.id}
                  onClick={() => {
                    setSelectedBranch(branch);
                    setInfoWindowType("BRANCH");
                    panToLocation(branch.lat, branch.lng);
                  }}
                  className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-3">
                    <BuildingStorefrontIcon className="w-6 h-6 text-green-800 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-green-800">{branch.name}</p>
                      <p className="text-sm text-gray-700 mt-1">{branch.address}</p>
                      <p className="flex items-center gap-2 text-green-700 font-medium mt-3">
                        <TruckIcon className="w-5 h-5" />
                        {branch.distance.toFixed(2)} km
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openGoogleMaps(branch);
                        }}
                        className="flex items-center gap-1.5 mt-2 text-amber-800 text-sm font-medium hover:underline"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        Chỉ đường
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tất cả chi nhánh */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">
              Tất cả chi nhánh
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBranches.map(branch => {
                const distance = mapLocation
                  ? getDistanceKm(
                    mapLocation.lat,
                    mapLocation.lng,
                    branch.lat,
                    branch.lng
                  )
                  : null;

                return (
                  <div
                    key={branch.id}
                    onClick={() => {
                      if (!mapLocation) return;
                      setSelectedBranch({ ...branch, distance: distance! });
                      setInfoWindowType("BRANCH");
                      panToLocation(branch.lat, branch.lng);
                    }}

                    className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <BuildingStorefrontIcon className="w-7 h-7 text-green-800 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-bold text-green-800 mb-2">
                          {branch.name}
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed flex items-start gap-2 mb-3">
                          <MapPinIcon className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                          {branch.address}
                        </p>
                        {distance !== null && (
                          <p className="text-green-700 font-medium flex items-center gap-2">
                            <TruckIcon className="w-5 h-5" />
                            {distance.toFixed(2)} km
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === i + 1
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </MapProvider>
  );
}