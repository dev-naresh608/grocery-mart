import mongoose from "mongoose";
import connectDB from "../configs/database.js";
import Address from "../modules/address/address.model.js";
import Driver from "../modules/driver/driver.model.js";
import Seller from "../modules/seller/seller.model.js";
import Customer from "../modules/customer/customer.model.js";
import User from "../modules/user/user.model.js";
import Order from "../modules/order/order.model.js";
import { addAddressSvc, updateAddressSvc } from "../modules/address/address.service.js";
import { createDriverSvc, updateDriverLocationSvc } from "../modules/driver/driver.services.js";
import { createSellerSvc, updateSellerLocationSvc } from "../modules/seller/seller.services.js";
import { registerSvc, loginSvc } from "../modules/auth/auth.service.js";
import { findAddress } from "../distanceCalculator.js";
import { validateCoordinates } from "../utils/geo.schema.js";

const results = [];
function recordTest(name, passed, detail = "") {
  results.push({ name, passed, detail });
  const symbol = passed ? "✅" : "❌";
  console.log(`${symbol} [${passed ? "PASS" : "FAIL"}] ${name} ${detail ? "- " + detail : ""}`);
}

async function runVerification() {
  console.log("==================================================");
  console.log("STARTING NOVEXA END-TO-END LOCATION SYSTEM VERIFICATION");
  console.log("==================================================\n");

  try {
    // 1. Verify Database Connection
    await connectDB();
    recordTest("MongoDB Connection", true, "Connected successfully");

    // 2. Sync all indexes to verify 2dsphere indexes build cleanly
    await Address.syncIndexes();
    await Driver.syncIndexes();
    await Seller.syncIndexes();
    recordTest("2dsphere Index Sync", true, "Address, Driver, and Seller 2dsphere indexes created");

    // 3. Test validateCoordinates Utility
    recordTest("Coordinate Validator: Valid Bangalore [77.5946, 12.9716]", validateCoordinates([77.5946, 12.9716]));
    recordTest("Coordinate Validator: Invalid Length [77.5946]", !validateCoordinates([77.5946]));
    recordTest("Coordinate Validator: Invalid Longitude 195.0", !validateCoordinates([195.0, 12.9716]));
    recordTest("Coordinate Validator: Invalid Latitude 95.0", !validateCoordinates([77.5946, 95.0]));
    recordTest("Coordinate Validator: Non-number values", !validateCoordinates(["77.5946", "12.9716"]));
    recordTest("Coordinate Validator: NaN values", !validateCoordinates([NaN, 12.9716]));

    // Generate test user IDs
    const customerUserId = new mongoose.Types.ObjectId();
    const sellerUserId = new mongoose.Types.ObjectId();
    const driverUserId = new mongoose.Types.ObjectId();

    // 4. Test Address Creation with explicit coordinates [longitude, latitude]
    const testAddress = await addAddressSvc(customerUserId, {
      name: "John Customer",
      phone: "9876543210",
      street: "123 MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: 560001,
      coordinates: [77.5946, 12.9716],
    });

    const isAddressValid =
      testAddress &&
      testAddress.location?.type === "Point" &&
      testAddress.location?.coordinates[0] === 77.5946 &&
      testAddress.location?.coordinates[1] === 12.9716;

    recordTest(
      "Address Creation with [lng, lat]",
      isAddressValid,
      `Saved: ${JSON.stringify(testAddress.location)}`,
    );

    // 5. Test Address Update
    const updatedAddress = await updateAddressSvc(testAddress._id, {
      street: "124 MG Road Ext",
      coordinates: [77.6000, 12.9800],
    });

    const isAddressUpdated =
      updatedAddress &&
      updatedAddress.location.coordinates[0] === 77.6000 &&
      updatedAddress.location.coordinates[1] === 12.9800 &&
      updatedAddress.street === "124 MG Road Ext";

    recordTest(
      "Address Update with new coordinates",
      isAddressUpdated,
      `Updated: ${JSON.stringify(updatedAddress?.location)}`,
    );

    // 6. Test Driver Creation Without Location (Normal Registration)
    const session = await mongoose.startSession();
    let testDriver;
    await session.withTransaction(async () => {
      testDriver = await createDriverSvc(
        driverUserId,
        {
          phone: "9876543211",
          driver_dob: "1995-01-01",
          driver_aadhaar_number: 123456789012,
          driver_vehicle_number: "KA01AB1234",
        },
        session,
      );
    });

    const isDriverClean = testDriver && testDriver.currentLocation === undefined;
    recordTest("Driver Registration (without currentLocation)", isDriverClean, "No currentLocation created at signup");

    // 7. Test Dedicated Driver Location Update (GPS point update)
    const updatedDriver = await updateDriverLocationSvc(driverUserId, [77.5950, 12.9720]);
    const isDriverLocUpdated =
      updatedDriver &&
      updatedDriver.currentLocation?.type === "Point" &&
      updatedDriver.currentLocation?.coordinates[0] === 77.5950 &&
      updatedDriver.currentLocation?.coordinates[1] === 12.9720;

    recordTest(
      "Dedicated Driver GPS Location Update",
      isDriverLocUpdated,
      `Updated GPS: ${JSON.stringify(updatedDriver?.currentLocation)}`,
    );

    // 8. Test Seller Creation with store_address and location [longitude, latitude]
    let testSeller;
    await session.withTransaction(async () => {
      testSeller = await createSellerSvc(
        sellerUserId,
        {
          phone: "9876543212",
          store_name: "Fresh Mart Indiranagar",
          store_owner_name: "Ramesh Store",
          store_type: "Grocery",
          store_address: "100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038",
          coordinates: [77.6413, 12.9784], // Indiranagar store [lng, lat]
        },
        session,
      );
    });

    const isSellerValid =
      testSeller &&
      testSeller.store_address === "100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038" &&
      testSeller.location?.type === "Point" &&
      testSeller.location?.coordinates[0] === 77.6413 &&
      testSeller.location?.coordinates[1] === 12.9784;

    recordTest(
      "Seller Creation: Textual Address & GeoJSON Location Separation",
      isSellerValid,
      `store_address (text) and location (GeoJSON) correctly stored`,
    );

    // 9. Test Store Location Update via updateSellerLocationSvc
    const updatedStore = await updateSellerLocationSvc(testSeller._id, [77.6420, 12.9790]);
    const isStoreUpdated =
      updatedStore &&
      updatedStore.location?.coordinates[0] === 77.6420 &&
      updatedStore.location?.coordinates[1] === 12.9790;
    recordTest("Store Location Update Svc", isStoreUpdated, `Updated store coords: [77.6420, 12.9790]`);

    // Create a 2nd seller ~50km away (outside 30km radius)
    const farSellerUserId = new mongoose.Types.ObjectId();
    let farSeller;
    await session.withTransaction(async () => {
      farSeller = await createSellerSvc(
        farSellerUserId,
        {
          phone: "9876543299",
          store_name: "Far Away Supermarket",
          store_owner_name: "Suresh",
          store_type: "Grocery",
          store_address: "Main Highway, Ramanagara",
          coordinates: [77.2754, 12.7209],
        },
        session,
      );
    });

    // 10. Test Geospatial Query: FEATURE 1 - Customer Address -> Nearest Stores within 30 km
    const nearbyStores30km = await Seller.find({
      is_store_open: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [77.6000, 12.9800], // Customer Address location
          },
          $maxDistance: 30000, // 30 km in meters
        },
      },
    });

    const foundNearStore = nearbyStores30km.some((s) => s._id.toString() === testSeller._id.toString());
    const excludedFarStore = !nearbyStores30km.some((s) => s._id.toString() === farSeller._id.toString());
    const isFeature1Working = foundNearStore && excludedFarStore;

    recordTest(
      "Geospatial Query: Feature 1 - Nearest Stores within 30 km ($near, $maxDistance: 30000)",
      isFeature1Working,
      `Found ${nearbyStores30km.length} store(s) within 30km; excluded distant store`,
    );

    // 11. Test Geospatial Query: FEATURE 2 - Store Location -> Nearest Available Drivers within 15 km
    const farDriverUserId = new mongoose.Types.ObjectId();
    let farDriver;
    await session.withTransaction(async () => {
      farDriver = await createDriverSvc(
        farDriverUserId,
        {
          phone: "9876543288",
          driver_dob: "1992-02-02",
          driver_aadhaar_number: 998877665544,
          driver_vehicle_number: "KA05CD5678",
        },
        session,
      );
    });
    await updateDriverLocationSvc(farDriverUserId, [77.8253, 12.7409]);

    const nearbyDrivers15km = await Driver.find({
      status: true,
      is_busy: false,
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [77.6420, 12.9790], // Store location
          },
          $maxDistance: 15000, // 15 km in meters
        },
      },
    });

    const foundNearDriver = nearbyDrivers15km.some((d) => d._id.toString() === testDriver._id.toString());
    const excludedFarDriver = !nearbyDrivers15km.some((d) => d._id.toString() === farDriver._id.toString());
    const isFeature2Working = foundNearDriver && excludedFarDriver;

    recordTest(
      "Geospatial Query: Feature 2 - Nearest Available Drivers within 15 km ($near, $maxDistance: 15000)",
      isFeature2Working,
      `Found ${nearbyDrivers15km.length} driver(s) within 15km; excluded distant driver`,
    );

    // 12. Customer Model Relationship Check
    const testCustomer = await Customer.create({
      user_id: customerUserId,
      customer_address: testAddress._id,
    });

    const populatedCustomer = await Customer.findById(testCustomer._id).populate("customer_address");
    const isCustomerModelCorrect =
      populatedCustomer &&
      populatedCustomer.customer_address?.location?.coordinates[0] === 77.6000 &&
      !populatedCustomer.location;

    recordTest(
      "Customer Model: References Address without duplicate location field",
      isCustomerModelCorrect,
      "Customer -> Address -> Address.location relationship confirmed",
    );

    // 13. Order Address Snapshot Verification
    const testOrder = await Order.create({
      customer_id: customerUserId,
      store_id: testSeller._id,
      store_name: "Fresh Mart",
      order_address: {
        street: "123 MG Road",
        city: "Bengaluru",
        location: {
          type: "Point",
          coordinates: [77.5946, 12.9716],
        },
      },
      store_address: "100 Feet Rd, Indiranagar",
      order_items: [{ name: "Apples", qty: 2 }],
      price_detail: { total: 100 },
    });

    const isOrderSnapshotted =
      testOrder &&
      testOrder.order_address?.location?.coordinates[0] === 77.5946 &&
      typeof testOrder.order_address === "object";

    recordTest(
      "Order Model: Delivery address stored as snapshot object",
      isOrderSnapshotted,
      "Order delivery location is immutable snapshot",
    );

    await session.endSession();

    // 14. Test End-to-End Registration Flow via registerSvc
    const uniqueSuffix = Date.now();
    const custRegRes = await registerSvc({
      username: `testcust_${uniqueSuffix}`,
      email: `cust_${uniqueSuffix}@example.com`,
      password: "password123",
      phone: `91${String(uniqueSuffix).slice(-8)}`,
      role: "customer",
    });
    recordTest("Auth Flow: Customer Registration via registerSvc", custRegRes.success, custRegRes.message);

    const sellerRegRes = await registerSvc({
      username: `testseller_${uniqueSuffix}`,
      email: `seller_${uniqueSuffix}@example.com`,
      password: "password123",
      phone: `92${String(uniqueSuffix).slice(-8)}`,
      role: "seller",
      store_name: "Test Store",
      store_owner_name: "Owner Test",
      store_type: "Grocery",
      store_address: "123 Test St, Bengaluru",
      coordinates: [77.5946, 12.9716],
    });
    recordTest("Auth Flow: Seller Registration with coordinates via registerSvc", sellerRegRes.success, sellerRegRes.message);

    const driverRegRes = await registerSvc({
      username: `testdriver_${uniqueSuffix}`,
      email: `driver_${uniqueSuffix}@example.com`,
      password: "password123",
      phone: `93${String(uniqueSuffix).slice(-8)}`,
      role: "driver",
      driver_dob: "1994-06-15",
      driver_aadhaar_number: "123456789099",
      driver_vehicle_number: "KA01XY9999",
    });
    recordTest("Auth Flow: Driver Registration (no initial location) via registerSvc", driverRegRes.success, driverRegRes.message);

    // Clean up all test documents
    await Address.deleteMany({ user_id: customerUserId });
    await Driver.deleteMany({ user_id: { $in: [driverUserId, farDriverUserId, driverRegRes.user?._id] } });
    await Seller.deleteMany({ user_id: { $in: [sellerUserId, farSellerUserId, sellerRegRes.user?._id] } });
    await Customer.deleteMany({ user_id: { $in: [customerUserId, custRegRes.user?._id] } });
    await Order.deleteMany({ _id: testOrder._id });
    await User.deleteMany({
      _id: { $in: [custRegRes.user?._id, sellerRegRes.user?._id, driverRegRes.user?._id] },
    });

    console.log("\n==================================================");
    const allPassed = results.every((r) => r.passed);
    console.log(`VERIFICATION COMPLETED: ${results.filter((r) => r.passed).length}/${results.length} TESTS PASSED`);
    console.log(`OVERALL STATUS: ${allPassed ? "ALL GREEN ✅" : "SOME FAILED ❌"}`);
    console.log("==================================================");

    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error("Verification failed with uncaught error:", error);
    process.exit(1);
  }
}

runVerification();
