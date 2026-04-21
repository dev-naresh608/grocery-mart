import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddressContext, UserContext } from "../../contexts/context";
function PersonalInfo() {
  const { currentUser, setCurrentUser, setUserData, setActiveTab } =
    useContext(UserContext);
  const { address } = useContext(AddressContext);
  const navigate = useNavigate();

  let currentUserAddress = "";
  let isAddressAvail = false;

  if (currentUser.hasOwnProperty("myAddress")) {
    isAddressAvail = true;
    currentUserAddress = `${currentUser.myAddress.name} ${currentUser.myAddress.phone} ${currentUser.myAddress.street} ${currentUser.myAddress.city} ${currentUser.myAddress.state}, ${currentUser.myAddress.pincode} `;
  }

  useEffect(() => setActiveTab("personalinformation"), []);

  const onDeleteAddress = () => {
    // setCurrentUser((prev) => delete prev.myAddress);
    // console.log("Current User: ",currentUser)
    delete currentUser.myAddress;
    // console.log("Current User: ",currentUser)

    const oldUserData = JSON.parse(localStorage.getItem("localUserData")) || [];

    let dataExceptCurrentUser = oldUserData.filter(
      (user) => user.id !== currentUser.id,
    );
    const newData = [...dataExceptCurrentUser, currentUser];

    // console.log('dataExceptCurrentUser: ',dataExceptCurrentUser)
    // console.log("new Data: ", newData);

    localStorage.setItem("localUserData", JSON.stringify(newData));
    setUserData(newData);
  };

  return (
    <>
      <div className="w-full h-full max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-5 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="text-sm text-gray-500">Manage your personal details</p>
        </div>

        {/* User Info */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Username</p>
            <h3 className="font-medium capitalize">{currentUser.username}</h3>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Email</p>
            <h3 className="font-medium text-md">{currentUser.email}</h3>
          </div>

          {currentUser.hasOwnProperty("phone") && (
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Phone</p>
              <h3 className="font-medium">{currentUser.phone}</h3>
            </div>
          )}
        </div>

        {/* Order Count */}
        <div className="bg-green-50 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Orders</p>
            <h3 className="text-xl font-semibold">
              {currentUser.role === "customer"
                ? currentUser.myOrders?.length === undefined
                  ? "0"
                  : `${currentUser.myOrders?.length}`
                : "seller"}
            </h3>
          </div>
          <button
            className="text-green-600 text-sm font-medium hover:underline"
            onClick={() => {
              (setActiveTab("orders"),
                currentUser.role === "customer"
                  ? navigate("/profile/orderhistory")
                  : navigate("/seller/orders"));
            }}
          >
            View Orders →
          </button>
        </div>

        {/* Address Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Saved Address</h3>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl text-sm text-gray-700">
            <p className="font-medium">Home</p>

            {isAddressAvail ? (
              <>
                <p>{currentUserAddress}</p>
                <div className="mt-2 flex gap-4 text-xs">
                  <button
                    className="text-blue-600"
                    onClick={() => navigate("/addressform")}
                  >
                    Edit
                  </button>
                  <button onClick={onDeleteAddress} className="text-red-500">
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>please Add Address</div>
                <button
                  onClick={() => navigate("/addressform")}
                  className="text-red-500"
                >
                  Add
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PersonalInfo;
