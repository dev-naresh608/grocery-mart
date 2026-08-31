import mongoose from "mongoose";
import connectDB from "../configs/database.js";
import User from "../modules/user/user.model.js";
import Customer from "../modules/customer/customer.model.js";
import Seller from "../modules/seller/seller.model.js";
import Driver from "../modules/driver/driver.model.js";
import Address from "../modules/address/address.model.js";
import { registerSvc, loginSvc, getMeSvc } from "../modules/auth/auth.service.js";
import { registerSchema, loginSchema } from "../modules/auth/auth.schema.js";

const results = [];
function recordTest(name, passed, detail = "") {
  results.push({ name, passed, detail });
  const symbol = passed ? "✅" : "❌";
  console.log(`${symbol} [${passed ? "PASS" : "FAIL"}] ${name} ${detail ? "- " + detail : ""}`);
}

async function runAuthAudit() {
  console.log("==================================================");
  console.log("STARTING FULL AUTHENTICATION & REGISTRATION DEEP AUDIT");
  console.log("==================================================\n");

  try {
    await connectDB();
    recordTest("Database Connection", true);

    const timestamp = Date.now();

    // 1. Zod Validation Tests
    const validCustData = {
      username: "CustUser",
      email: `cust_${timestamp}@example.com`,
      password: "pass1234Password",
      phone: "9876543210",
      role: "customer",
    };
    const custZod = registerSchema.safeParse(validCustData);
    recordTest("Zod: Customer Registration Schema", custZod.success, custZod.success ? "Passed" : JSON.stringify(custZod.error));

    const validSellerDataWithCoords = {
      username: "SellerUser",
      email: `seller_${timestamp}@example.com`,
      password: "pass1234Password",
      phone: "9876543211",
      role: "seller",
      store_name: "Fresh Store",
      store_owner_name: "SellerUser",
      store_type: "Grocery",
      store_address: "123 Main St, Bangalore",
    };
    const sellerZod = registerSchema.safeParse(validSellerDataWithCoords);
    recordTest("Zod: Seller Registration Schema", sellerZod.success, sellerZod.success ? "Passed" : JSON.stringify(sellerZod.error));

    const validDriverData = {
      username: "DriverUser",
      email: `driver_${timestamp}@example.com`,
      password: "pass1234Password",
      phone: "9876543212",
      role: "driver",
      driver_dob: "1995-05-15",
      driver_aadhaar_number: "123456789012",
      driver_vehicle_number: "KA01XY1234",
    };
    const driverZod = registerSchema.safeParse(validDriverData);
    recordTest("Zod: Driver Registration Schema", driverZod.success, driverZod.success ? "Passed" : JSON.stringify(driverZod.error));

    const loginZod = loginSchema.safeParse({
      email: `cust_${timestamp}@example.com`,
      password: "pass1234Password",
    });
    recordTest("Zod: Login Schema", loginZod.success);

    // 2. Customer Registration Flow
    const custRes = await registerSvc(validCustData);
    const isCustCreated =
      custRes.success &&
      custRes.user &&
      custRes.user.role === "customer" &&
      custRes.accessToken &&
      custRes.refreshToken;
    recordTest("Customer Registration Service", isCustCreated, `User ID: ${custRes.user?._id}`);

    // Customer Login Flow
    const custLoginRes = await loginSvc({
      email: validCustData.email,
      password: validCustData.password,
    });
    const isCustLoggedIn =
      custLoginRes.success &&
      custLoginRes.user.role === "customer" &&
      Array.isArray(custLoginRes.user.myCart) &&
      custLoginRes.accessToken;
    recordTest("Customer Login Flow", isCustLoggedIn, "Returned customer-specific fields (myCart, myWishlist)");

    // 3. Seller Registration Flow (WITHOUT Coordinates - Manual Address)
    const sellerResNoCoords = await registerSvc(validSellerDataWithCoords);
    const isSellerCreated =
      sellerResNoCoords.success &&
      sellerResNoCoords.user &&
      sellerResNoCoords.user.role === "seller" &&
      sellerResNoCoords.user.store_name === "Fresh Store";
    recordTest(
      "Seller Registration (without GPS coordinates)",
      isSellerCreated,
      `Store: ${sellerResNoCoords.user?.store_name}, ID: ${sellerResNoCoords.user?.store_id}`
    );

    // Seller Login Flow
    const sellerLoginRes = await loginSvc({
      email: validSellerDataWithCoords.email,
      password: validSellerDataWithCoords.password,
    });
    const isSellerLoggedIn =
      sellerLoginRes.success &&
      sellerLoginRes.user.role === "seller" &&
      sellerLoginRes.user.store_name === "Fresh Store" &&
      sellerLoginRes.user.store_address === "123 Main St, Bangalore";
    recordTest("Seller Login Flow", isSellerLoggedIn, `Store Name: ${sellerLoginRes.user?.store_name}`);

    // 4. Seller Registration Flow (WITH GPS Coordinates)
    const sellerResWithCoords = await registerSvc({
      username: "GPS Seller",
      email: `gps_seller_${timestamp}@example.com`,
      password: "pass1234Password",
      phone: "9876543213",
      role: "seller",
      store_name: "GPS Organic Mart",
      store_owner_name: "GPS Seller",
      store_type: "Fruits & Vegetables",
      store_address: "Indiranagar 100ft Road, Bangalore",
      coordinates: [77.6413, 12.9784],
    });
    const isGpsSellerCreated =
      sellerResWithCoords.success &&
      sellerResWithCoords.user &&
      sellerResWithCoords.user.store_name === "GPS Organic Mart";
    recordTest(
      "Seller Registration (WITH GPS coordinates [77.6413, 12.9784])",
      isGpsSellerCreated,
      "Coordinates safely ingested during signup"
    );

    // Verify stored coordinates in MongoDB
    const gpsSellerDoc = await Seller.findById(sellerResWithCoords.user.store_id);
    const hasCorrectCoords =
      gpsSellerDoc &&
      gpsSellerDoc.location?.coordinates[0] === 77.6413 &&
      gpsSellerDoc.location?.coordinates[1] === 12.9784;
    recordTest("Seller MongoDB GeoJSON Location Record", hasCorrectCoords, `Location: ${JSON.stringify(gpsSellerDoc?.location)}`);

    // 5. Driver Registration Flow
    const driverRes = await registerSvc(validDriverData);
    const isDriverCreated =
      driverRes.success &&
      driverRes.user &&
      driverRes.user.role === "driver" &&
      driverRes.user.driver_vehicle_number === "KA01XY1234";
    recordTest(
      "Driver Registration Flow",
      isDriverCreated,
      `Vehicle: ${driverRes.user?.driver_vehicle_number}, Aadhaar: ${driverRes.user?.driver_aadhaar_number}`
    );

    // Driver Login Flow
    const driverLoginRes = await loginSvc({
      email: validDriverData.email,
      password: validDriverData.password,
    });
    const isDriverLoggedIn =
      driverLoginRes.success &&
      driverLoginRes.user.role === "driver" &&
      driverLoginRes.user.driver_vehicle_number === "KA01XY1234";
    recordTest("Driver Login Flow", isDriverLoggedIn, `Role: ${driverLoginRes.user?.role}`);

    // 6. Test Error Cases & Security
    // Duplicate Email Check
    const dupEmailRes = await registerSvc(validCustData);
    recordTest("Security: Reject Duplicate Email", !dupEmailRes.success, dupEmailRes.message);

    // Invalid Password Login
    const wrongPassRes = await loginSvc({
      email: validCustData.email,
      password: "WrongPassword!99",
    });
    recordTest("Security: Reject Wrong Password", !wrongPassRes.success, wrongPassRes.message);

    // Non-existent Email Login
    const noUserRes = await loginSvc({
      email: `nonexistent_${timestamp}@example.com`,
      password: "pass1234Password",
    });
    recordTest("Security: Reject Non-Existent Email", !noUserRes.success, noUserRes.message);

    // 7. Test getMeSvc for Session Verification
    const getMeCust = await getMeSvc(custRes.user._id);
    recordTest("Session: getMeSvc Customer", getMeCust.success && getMeCust.user.role === "customer");

    const getMeSeller = await getMeSvc(sellerResWithCoords.user._id);
    recordTest("Session: getMeSvc Seller", getMeSeller.success && getMeSeller.user.role === "seller");

    const getMeDriver = await getMeSvc(driverRes.user._id);
    recordTest("Session: getMeSvc Driver", getMeDriver.success && getMeDriver.user.role === "driver");

    // Clean up test data
    const createdUserIds = [
      custRes.user?._id,
      sellerResNoCoords.user?._id,
      sellerResWithCoords.user?._id,
      driverRes.user?._id,
    ].filter(Boolean);

    await User.deleteMany({ _id: { $in: createdUserIds } });
    await Customer.deleteMany({ user_id: { $in: createdUserIds } });
    await Seller.deleteMany({ user_id: { $in: createdUserIds } });
    await Driver.deleteMany({ user_id: { $in: createdUserIds } });

    console.log("\n==================================================");
    const allPassed = results.every((r) => r.passed);
    console.log(`AUTH AUDIT COMPLETED: ${results.filter((r) => r.passed).length}/${results.length} TESTS PASSED`);
    console.log(`OVERALL AUTH HEALTH: ${allPassed ? "100% OPERATIONAL & BUG-FREE ✅" : "ISSUES FOUND ❌"}`);
    console.log("==================================================");

    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error("Auth Audit failed with error:", error);
    process.exit(1);
  }
}

runAuthAudit();
