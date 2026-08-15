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

