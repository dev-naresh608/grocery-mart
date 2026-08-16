import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { CheckCircle, MailCheck, Mail } from "lucide-react";
import { MiniProfileContainer } from "..";
import { db } from "../../db";

function NotificationToggle() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isNotificationClicked, setIsNotificationClicked] = useState(false);
  const isAllNotificationsRead = currentUser?.myNotifications?.every(
    (n) => n.isNotificationIsRead
  ) ?? true;

  const handleNotificationIsRead = async (notificationID) => {
    if (!currentUser) return;
    const allNotifications = currentUser.myNotifications || [];
    const updatedNotifications = allNotifications.map((n) =>
      n.notificationID === notificationID
        ? { ...n, isNotificationIsRead: true }
        : n
    );
    dispatch(updateUser({ myNotifications: updatedNotifications }));
    if (currentUser.id) {
      try {
        const user = await db.localUserData.get(currentUser.id);
        if (user) {
          user.myNotifications = updatedNotifications;
          await db.localUserData.put(user);
        }
      } catch (err) {
        console.error("Failed to update notification status in DB:", err);
      }
    }
  };

  return (
    <div className="relative group">
      <div>
        <button
          onClick={() => {
            setIsNotificationClicked((prev) => !prev);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="27px"
            viewBox="0 -960 960 960"
            width="27px"
            fill="#15803D"
            className="absolute top-1 right-0"
          >
            <path d="M180-204.62v-59.99h72.31v-298.47q0-80.69 49.81-142.69 49.8-62 127.88-79.31V-810q0-20.83 14.57-35.42Q459.14-860 479.95-860q20.82 0 35.43 14.58Q530-830.83 530-810v24.92q78.08 17.31 127.88 79.31 49.81 62 49.81 142.69v298.47H780v59.99H180Zm300-293.07Zm-.07 405.38q-29.85 0-51.04-21.24-21.2-21.24-21.2-51.07h144.62q0 29.93-21.26 51.12-21.26 21.19-51.12 21.19Zm-167.62-172.3h335.38v-298.47q0-69.46-49.11-118.57-49.12-49.12-118.58-49.12-69.46 0-118.58 49.12-49.11 49.11-49.11 118.57v298.47Z" />
          </svg>
        </button>
        {isAllNotificationsRead && (
          <span className="absolute group-hover:animate-bounce top-1 right-0 h-1 w-1 rounded-full bg-red-600"></span>
        )}
      </div>
      {/* Go to the Notification section */}
      <div
        className={`absolute shadow-md top-8 right-0 bg-white rounded-xl min-w-[230px] sm:w-[30vw] md:w-[35vw] pb-2 z-[100] ${isNotificationClicked ? "block" : "hidden"}`}
      >
        <div className="flex gap-2 justify-between border-b">
          {/* Mini Profile Container */}
          <div className="p-2">
            <MiniProfileContainer />
          </div>
          <div className="absolute right-1 top-0">
            <button
              onClick={() => {
                setIsNotificationClicked(false);
              }}
            >
              ✘
            </button>
          </div>
        </div>
        <div>
          {/* notifications  */}
          {isAllNotificationsRead ? (
            <>
              <div className="flex-1 min-h-[230px]">
                {currentUser?.myNotifications
                  ?.filter((n) => !n?.isNotificationIsRead)
                  .map((n, i) => {
                    return (
                      <div key={i} className=" h-full p-2">
                        <div className="min-h-20 p-1 flex flex-col justify-between border rounded-md">
                          <div
                            className={`text-sm ${!n.isNotificationIsRead ? "text-gray-600" : "text-gray-400"}`}
                          >
                            <p>{n.message}</p>
                          </div>

                          <div className="text-gray-500 font-semibold hover:text-gray-600 flex justify-end items-end">
                            <button
                              onClick={() =>
                                handleNotificationIsRead(n.notificationID)
                              }
                              className="flex hover:fill-gray-600  items-center text-sm gap-1"
                            >
                              <Mail size={17} />
                              Mark As read
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <>
              <div className=" min-h-[230px] flex flex-col items-center">
                <div className="m-auto text-xs text-gray-800/80 rounded-2xl px-2 py-1 flex items-center w-max gap-2 ">
                  <CheckCircle size={12} className="text-green-600" />
                  <span>All caught up!</span>
                </div>
              </div>
            </>
          )}

          {/* Show All Notifications History Button */}

          <div className="flex justify-center w-full pt-2">
            <NavLink
              onClick={() => {
                setIsNotificationClicked(false);
              }}
              to="allnotifications"
              className="group/btn overflow-hidden w-max flex items-center gap-2 text-sm bg-gray-200 px-3 py-1 rounded-2xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="black"
                className="transform transition-transform duration-700 ease-in-out group-hover/btn:rotate-[360deg] pointer-events-none w-5 h-5 block"
              >
                <path d="M479.23-140q-129.92 0-226.46-85.54Q156.23-311.08 141.62-440h61.23Q218-336.38 296.12-268.19 374.23-200 479.23-200q117 0 198.5-81.5t81.5-198.5q0-117-81.5-198.5T479.23-760q-65.54 0-122.84 29.12-57.31 29.11-98.7 80.11h104.62v60H159.23v-203.08h60v94.77q48.69-57.46 116.62-89.19Q403.77-820 479.23-820q70.77 0 132.62 26.77 61.84 26.77 107.84 72.77t72.77 107.85q26.77 61.84 26.77 132.61 0 70.77-26.77 132.61-26.77 61.85-72.77 107.85-46 46-107.84 72.77Q550-140 479.23-140Zm120.08-178.92L450.39-467.85V-680h59.99v187.85l131.08 131.07-42.15 42.16Z" />
              </svg>
              <span>View All Activity</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationToggle;
