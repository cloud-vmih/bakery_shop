import { getDistanceKm } from "./distance";

export function calculateShippingFee(
  branchLat: number,
  branchLng: number,
  customerLat: number,
  customerLng: number
): number {
  const distance = getDistanceKm(branchLat, branchLng, customerLat, customerLng);

  if (distance < 3) return 0;
  if (distance <= 7) return 30000;
  return 30000 + Math.ceil(distance - 7) * 5000;
}