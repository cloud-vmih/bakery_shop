import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

export interface AddressResult {
  fullAddress: string;
  lat: number;
  lng: number;
  placeId?: string;
}

interface Props {
  onSelect: (address: AddressResult) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function AddressAutocomplete({
  onSelect,
  placeholder,
  disabled = false,
}: Props) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry?.location) return;

    onSelect({
      fullAddress: place.formatted_address || "",
      lat: place.geometry?.location?.lat(),
      lng: place.geometry?.location?.lng(),
      placeId: place.place_id,
    });
  };

  return (
    <Autocomplete
      onLoad={(ac) => (autocompleteRef.current = ac)}
      onPlaceChanged={handlePlaceChanged}
      options={{
        componentRestrictions: { country: "vn" },
        fields: ["formatted_address", "geometry", "place_id"],
      }}
    >
      <input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className="searchInput w-full"
        style={{
          padding: "0.5rem 0.75rem",
          fontSize: "0.875rem",
        }}
      />
    </Autocomplete>
  );
}
