import {
  getDistanceAndETA,
  findAddress,
  reverseGeocode,
} from "../distanceCalculator.js";

export async function handleGetDistanceAndEta(req, res) {
  const { lat1, lon1, lat2, lon2 } = req.query;
  const result = await getDistanceAndETA(
    Number(lat1),
    Number(lon1),
    Number(lat2),
    Number(lon2),
  );
  return res.json(result);
}

export async function handleGetAddressApi(req, res) {
  const { userAddress } = req.query;
  const result = await findAddress(userAddress);
  return res.json(result);
}

export async function handleReverseGeocodeApi(req, res) {
  const { lat, latitude, lng, lon, longitude } = req.query;
  const targetLat = lat || latitude;
  const targetLon = lng || lon || longitude;
  const result = await reverseGeocode(targetLat, targetLon);
  return res.json(result);
}
