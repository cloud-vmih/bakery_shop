import { useEffect, useState } from "react";
import GooglePlaceInput from "./AddressAutocomplete";
import toast from "react-hot-toast";
import MapProvider from "../components/MapProvider";
type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
};

export default function BranchModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [name, setName] = useState("");
  const [place, setPlace] = useState<any>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "")
      setPlace({
        placeId: initialData.address.placeId,
        fullAddress: initialData.address.fullAddress,
        lat: initialData.address.lat,
        lng: initialData.address.lng
      });
    }
    else {
      setName("");
      setPlace(null);
    }
    
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!place) return toast.error("Chưa chọn địa chỉ");

    onSubmit({
      branch: { name },
      address: {
        placeId: place.placeId,
        formattedAddress: place.fullAddress,
        latitude: place.lat,
        longitude: place.lng,
      },
    });
  };

  return (
    <MapProvider>
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 w-full max-w-md rounded">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Update Branch" : "Create Branch"}
        </h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Branch name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <GooglePlaceInput onSelect={setPlace} />

        {place && (
          <p className="text-sm text-gray-600 mb-3">
            📍 {place.fullAddress}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    </MapProvider>
  );
}