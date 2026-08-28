import React from "react";
import { useSelector } from "react-redux";
import { Mail, User } from "lucide-react";

function MiniProfileContainer() {
  const { user: currentUser } = useSelector((state) => state.auth);

  return (
    <div className="flex items-center gap-2">
      <div className="h-9 w-9 flex-shrink-0">
        {currentUser?.imageUrl || currentUser?.profile_picture ? (
          <img
            loading="lazy"
            className="object-cover h-full w-full border border-orange-400 rounded-full"
            src={currentUser.imageUrl || currentUser.profile_picture}
            alt="profile picture"
          />
        ) : (
          <div className="h-full w-full border border-orange-400 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
            <User size={18} strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="overflow-hidden">
        <p className="text-base font-semibold truncate">
          {currentUser?.username}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <Mail
            size={11}
            className="text-gray-400 flex-shrink-0"
            strokeWidth={2}
          />
          <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default MiniProfileContainer;
