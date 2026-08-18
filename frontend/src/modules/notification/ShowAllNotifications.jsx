import React from "react";
import { useSelector } from "react-redux";
import { GradientButton } from "@/components";

function ShowAllNotifications() {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (
    !currentUser?.myNotifications ||
    currentUser.myNotifications.length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-600">
          No Notifications Yet
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          There is a no previuos notifications
        </p>
      </div>
    );
  }

  return (
    <div>
      <GradientButton componentType="text"> All Notifications</GradientButton>
      {currentUser?.myNotifications?.map((n, i) => (
        <div key={i} className="h-full p-2">
          <div className="p-1 flex flex-col justify-between border rounded-md">
            <div className="text-gray-400">
              <p>{n.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShowAllNotifications;
