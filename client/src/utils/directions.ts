export const getDirections = (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
): Promise<google.maps.DirectionsResult> => {
  return new Promise((resolve, reject) => {
    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          resolve(result);
        } else {
          reject(status);
        }
      }
    );
  });
};