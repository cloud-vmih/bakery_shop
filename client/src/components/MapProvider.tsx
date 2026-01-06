import { useJsApiLoader } from "@react-google-maps/api";

export default function MapProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY!,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return <>{children}</>;
}
