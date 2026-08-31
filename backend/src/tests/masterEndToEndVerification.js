import mongoose from "mongoose";
import connectDB from "../configs/database.js";
import User from "../modules/user/user.model.js";
import Customer from "../modules/customer/customer.model.js";
import Seller from "../modules/seller/seller.model.js";
import Driver from "../modules/driver/driver.model.js";
import Address from "../modules/address/address.model.js";
import Order from "../modules/order/order.model.js";
import { registerSvc, loginSvc, getMeSvc } from "../modules/auth/auth.service.js";
import { addAddressSvc, updateAddressSvc, deleteAddressSvc } from "../modules/address/address.service.js";
import { updateDriverLocationSvc } from "../modules/driver/driver.services.js";
import { updateSellerLocationSvc } from "../modules/seller/seller.services.js";
import { findAddress, reverseGeocode, getDistanceAndETA } from "../distanceCalculator.js";
import { validateCoordinates } from "../utils/geo.schema.js";

const testResults = [];
function logTest(category, name, passed, detail = "") {
  testResults.push({ category, name, passed, detail });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} [${category}] ${name} ${detail ? "→ " + detail : ""}`);
}

async function runMasterVerification() {
  console.log("================================================================================");
  console.log("🚀 NOVEXA MASTER END-TO-END VERIFICATION SUITE");
  console.log("================================================================================\n");

  try {
    // 1. Database & Indexes
    await connectDB();
    logTest("DB", "MongoDB Connection", true, "Connected to MongoDB successfully");

    await Address.syncIndexes();
    await Driver.syncIndexes();
    await Seller.syncIndexes();
    logTest("DB", "2dsphere Indexes Sync", true, "Address.location, Driver.currentLocation, Seller.location indexes synchronized");

    // 2. Coordinate Validator
    logTest("GEO-VALIDATION", "Valid Bangalore Coordinates [77.5946, 12.9716]", validateCoordinates([77.5946, 12.9716]));
    logTest("GEO-VALIDATION", "Reject Invalid Array Length [77.5946]", !validateCoordinates([77.5946]));
    logTest("GEO-VALIDATION", "Reject Longitude Out of Range 185.0", !validateCoordinates([185.0, 12.9716]));
    logTest("GEO-VALIDATION", "Reject Latitude Out of Range -95.0", !validateCoordinates([77.5946, -95.0]));
    logTest("GEO-VALIDATION", "Reject Non-Numeric Strings ['77.5946', '12.9716']", !validateCoordinates(["77.5946", "12.9716"]));
    logTest("GEO-VALIDATION", "Reject NaN Values [NaN, 12.9716]", !validateCoordinates([NaN, 12.9716]));

    const uniqueId = Date.now();

    // 3. Geocoding & Reverse Geocoding Services
    const reverseRes = await reverseGeocode(12.9716, 77.5946);
    const isReverseValid =
      reverseRes &&
      reverseRes.success &&
      Boolean(reverseRes.formattedAddress || reverseRes.city);
    logTest("GEO-SERVICES", "Reverse Geocode (Lat 12.9716, Lng 77.5946)", isReverseValid, `Resolved: ${reverseRes.formattedAddress?.slice(0, 50)}...`);

    const distanceRes = getDistanceAndETA(12.9716, 77.5946, 12.9352, 77.6245);
    const isDistanceValid = distanceRes && distanceRes.distanceKm > 0 && distanceRes.etaHours > 0;
    logTest("GEO-SERVICES", "Distance & ETA Calculation", isDistanceValid, `Distance: ${distanceRes.distanceKm.toFixed(2)} km, ETA: ${(distanceRes.etaHours * 60).toFixed(0)} mins`);

    // 4. Customer Flow (Signup, Login, Address CRUD with Geocoding)
    const customerPayload = {
      username: `MasterCust_${uniqueId}`,
      email: `cust_${uniqueId}@example.com`,
      password: "MasterPassword123!",
      phone: `91${String(uniqueId).slice(-8)}`,
      role: "customer",
    };

    const custReg = await registerSvc(customerPayload);
    logTest("CUSTOMER", "Customer Registration Service", custReg.success, `User ID: ${custReg.user?._id}`);

    const custLogin = await loginSvc({
      email: customerPayload.email,
      password: customerPayload.password,
    });
    logTest("CUSTOMER", "Customer Login Service", custLogin.success && custLogin.user.role === "customer", "Returned access/refresh tokens and cart/wishlist state");

    // Address with Direct Coordinates
    const addrWithCoords = await addAddressSvc(custReg.user._id, {
      name: "John Home",
      phone: "9876543210",
      street: "100 Feet Rd, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: 560038,
      coordinates: [77.6413, 12.9784],
    });
    const isAddr1Valid =
      addrWithCoords &&
      addrWithCoords.location?.type === "Point" &&
      addrWithCoords.location?.coordinates[0] === 77.6413 &&
      addrWithCoords.location?.coordinates[1] === 12.9784;
    logTest("ADDRESS", "Address Creation with GPS Coordinates", isAddr1Valid, `Coords: ${JSON.stringify(addrWithCoords.location?.coordinates)}`);

    // Address with Manual Text (Testing Automatic Backend Geocoding Fallback)
    const addrWithText = await addAddressSvc(custReg.user._id, {
      name: "John Office",
      phone: "9876543210",
      street: "MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: 560001,
    });
    const isAddr2Valid =
      addrWithText &&
      addrWithText.location?.type === "Point" &&
      Array.isArray(addrWithText.location?.coordinates) &&
      addrWithText.location.coordinates.length === 2;
    logTest("ADDRESS", "Address Creation with Textual Geocoding Fallback", isAddr2Valid, `Auto-geocoded to: ${JSON.stringify(addrWithText.location?.coordinates)}`);

    // Address Update
    const updatedAddr = await updateAddressSvc(addrWithCoords._id, {
      street: "100 Feet Rd, 2nd Stage",
      coordinates: [77.6420, 12.9790],
    });
    const isAddrUpdated =
      updatedAddr &&
      updatedAddr.location?.coordinates[0] === 77.6420 &&
      updatedAddr.street === "100 Feet Rd, 2nd Stage";
    logTest("ADDRESS", "Address Update with New Coordinates", isAddrUpdated, "Updated successfully");

    // Address Deletion
    const deletedAddr = await deleteAddressSvc(addrWithText._id);
    logTest("ADDRESS", "Address Deletion", Boolean(deletedAddr), `Deleted Address ID: ${addrWithText._id}`);

    // 5. Seller Flow (Signup with Address String, Store Location Update, Nearest Store Discovery)
    const sellerPayload = {
      username: `MasterSeller_${uniqueId}`,
      email: `seller_${uniqueId}@example.com`,
      password: "MasterPassword123!",
      phone: `92${String(uniqueId).slice(-8)}`,
      role: "seller",
      store_name: "Novexa Fresh Indiranagar",
      store_owner_name: `MasterSeller_${uniqueId}`,
      store_type: "Fruits & Vegetables",
      store_address: "Shop 12, 100 Feet Road, Indiranagar, Bengaluru, 560038",
    };

    const sellerReg = await registerSvc(sellerPayload);
    const isSellerCreated =
      sellerReg.success &&
      sellerReg.user &&
      sellerReg.user.store_name === "Novexa Fresh Indiranagar" &&
      sellerReg.user.store_address === "Shop 12, 100 Feet Road, Indiranagar, Bengaluru, 560038";
    logTest("SELLER", "Seller Registration (Address Text)", isSellerCreated, `Store ID: ${sellerReg.user?.store_id}`);

    // Verify Seller GeoJSON Point in MongoDB (or attach location)
    const sellerDoc = await Seller.findById(sellerReg.user.store_id);
    await updateSellerLocationSvc(sellerDoc._id, [77.6413, 12.9784]);

    // Create a distant store outside 30km (e.g. Ramanagara ~55km away)
    const farSellerReg = await registerSvc({
      username: `FarSeller_${uniqueId}`,
      email: `farseller_${uniqueId}@example.com`,
      password: "MasterPassword123!",
      phone: `93${String(uniqueId).slice(-8)}`,
      role: "seller",
      store_name: "Distant Rural Mart",
      store_owner_name: `FarSeller_${uniqueId}`,
      store_type: "Grocery",
      store_address: "Highway 275, Ramanagara, Karnataka 562159",
    });
    await updateSellerLocationSvc(farSellerReg.user?.store_id, [77.2754, 12.7209]);

    // Geospatial Query: Customer Address -> 30 km Nearest Store Discovery
    const nearbyStores30km = await Seller.find({
      is_store_open: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [77.6420, 12.9790], // Customer location in Indiranagar
          },
          $maxDistance: 30000, // 30 km in meters
        },
      },
    });

    const hasNearStore = nearbyStores30km.some((s) => s._id.toString() === sellerDoc._id.toString());
    const excludedFarStore = !nearbyStores30km.some((s) => s._id.toString() === farSellerReg.user?.store_id?.toString());
    logTest("GEOSPATIAL", "Feature 1: 30 km Nearest Store Discovery ($near, $maxDistance: 30000)", hasNearStore && excludedFarStore, `Found ${nearbyStores30km.length} nearby store(s), excluded 55km distant store`);

    // 6. Driver Flow (Signup without location, GPS update API, 15 km Driver Dispatch Discovery)
    const driverPayload = {
      username: `MasterDriver_${uniqueId}`,
      email: `driver_${uniqueId}@example.com`,
      password: "MasterPassword123!",
      phone: `94${String(uniqueId).slice(-8)}`,
      role: "driver",
      driver_dob: "1993-08-20",
      driver_aadhaar_number: "987654321098",
      driver_vehicle_number: "KA03MN4567",
    };

    const driverReg = await registerSvc(driverPayload);
    const driverDocBefore = await Driver.findOne({ user_id: driverReg.user._id });
    const isDriverInitialClean =
      driverDocBefore &&
      driverDocBefore.currentLocation === undefined;
    logTest("DRIVER", "Driver Signup (Initial currentLocation is undefined)", isDriverInitialClean, "No false [0,0] coordinates stored at registration");

    // Update Driver GPS Location
    const updatedDriver = await updateDriverLocationSvc(driverReg.user._id, [77.6430, 12.9800]);
    const isDriverGpsSaved =
      updatedDriver &&
      updatedDriver.currentLocation?.type === "Point" &&
      updatedDriver.currentLocation?.coordinates[0] === 77.6430 &&
      updatedDriver.currentLocation?.coordinates[1] === 12.9800;
    logTest("DRIVER", "Dedicated Driver GPS Update Service", isDriverGpsSaved, `Updated GPS: ${JSON.stringify(updatedDriver?.currentLocation)}`);

    // Create a distant driver outside 15km (e.g. Hosur ~35km away)
    const farDriverReg = await registerSvc({
      username: `FarDriver_${uniqueId}`,
      email: `fardriver_${uniqueId}@example.com`,
      password: "MasterPassword123!",
      phone: `95${String(uniqueId).slice(-8)}`,
      role: "driver",
      driver_dob: "1991-01-10",
      driver_aadhaar_number: "876543210987",
      driver_vehicle_number: "TN70AB9999",
    });
    await updateDriverLocationSvc(farDriverReg.user._id, [77.8253, 12.7409]);

    // Geospatial Query: Store Location -> 15 km Nearest Driver Allocation
    const nearbyDrivers15km = await Driver.find({
      status: true,
      is_busy: false,
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [77.6425, 12.9795], // Indiranagar store location
          },
          $maxDistance: 15000, // 15 km in meters
        },
      },
    });

    const hasNearDriver = nearbyDrivers15km.some((d) => d.user_id.toString() === driverReg.user._id.toString());
    const excludedFarDriver = !nearbyDrivers15km.some((d) => d.user_id.toString() === farDriverReg.user._id.toString());
    logTest("GEOSPATIAL", "Feature 2: 15 km Driver Dispatch Discovery ($near, $maxDistance: 15000)", hasNearDriver && excludedFarDriver, `Found ${nearbyDrivers15km.length} available driver(s), excluded 35km distant driver`);

    // 7. Order Address Snapshot Verification
    const orderTest = await Order.create({
      customer_id: custReg.user._id,
      store_id: sellerDoc._id,
      store_name: sellerDoc.store_name,
      order_address: {
        street: "100 Feet Rd, Indiranagar",
        city: "Bengaluru",
        location: {
          type: "Point",
          coordinates: [77.6413, 12.9784],
        },
      },
      store_address: sellerDoc.store_address,
      order_items: [{ name: "Organic Mangoes", quantity: 2, price: 150 }],
      price_detail: { totalAmount: 300 },
    });

    // Delete customer address to verify order immutability
    await Address.deleteMany({ user_id: custReg.user._id });
    const fetchedOrder = await Order.findById(orderTest._id);
    const isOrderImmune =
      fetchedOrder &&
      fetchedOrder.order_address?.location?.coordinates[0] === 77.6413 &&
      fetchedOrder.order_address?.street === "100 Feet Rd, Indiranagar";
    logTest("ORDER", "Order Delivery Address Snapshot Immutability", isOrderImmune, "Order record remained intact after customer address deletion");

    // Clean up test documents
    const testUserIds = [
      custReg.user?._id,
      sellerReg.user?._id,
      farSellerReg.user?._id,
      driverReg.user?._id,
      farDriverReg.user?._id,
    ].filter(Boolean);

    await User.deleteMany({ _id: { $in: testUserIds } });
    await Customer.deleteMany({ user_id: { $in: testUserIds } });
    await Seller.deleteMany({ user_id: { $in: testUserIds } });
    await Driver.deleteMany({ user_id: { $in: testUserIds } });
    await Order.deleteMany({ _id: orderTest._id });

    console.log("\n================================================================================");
    const allPassed = testResults.every((t) => t.passed);
    const passCount = testResults.filter((t) => t.passed).length;
    console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${passCount} | FAILED: ${testResults.length - passCount}`);
    console.log(`FINAL END-TO-END VERIFICATION STATUS: ${allPassed ? "100% SUCCESSFUL (ALL GREEN ✅)" : "SOME FAILED ❌"}`);
    console.log("================================================================================");

    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error("Master verification encountered an error:", error);
    process.exit(1);
  }
}

runMasterVerification();
