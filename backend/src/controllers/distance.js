import { getDistanceAndETA, findAddress } from "../distanceCalculator.js";

export async function handleGetDistanceAndEta(req, res) {
  const { lat1, lon1, lat2, lon2 } = req.query;
  const result = await getDistanceAndETA(
    Number(lat1),
    Number(lon1),
    Number(lat2),
    Number(lon2),
  );
  // console.log(result);
  return res.json(result);
}

export async function handleGetAddressApi(req, res) {
  const { userAddress } = req.query;
  const result = await findAddress(userAddress);
  return res.json(result);
}
