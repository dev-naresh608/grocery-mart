import Driver from "./driver.model.js";

export const createDriverSvc = async (userId, payload, session) => {
  const { phone, driver_dob, driver_vehicle_number, driver_aadhaar_number } =
    payload;

  const drivers = await Driver.create(
    [
      {
        user_id: userId,
        phone: phone,
        dob: driver_dob,
        aadhaar_number: driver_aadhaar_number,
        vehicle_number: driver_vehicle_number,
      },
    ],
    { session },
  );

  return drivers[0];
};

export const updateDriverLocationSvc = async (userId, coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    throw new Error("Coordinates must be an array of [longitude, latitude]");
  }

  const [longitude, latitude] = coordinates;
  return await Driver.findOneAndUpdate(
    { user_id: userId },
    {
      currentLocation: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    },
    { new: true, runValidators: true },
  );
};

