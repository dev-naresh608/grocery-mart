import React from "react";
import { useSelector } from "react-redux";
import { defaultPP } from "@/assets";
import { Mail } from "lucide-react";

function MiniProfileContainer() {
  const { user: currentUser } = useSelector((state) => state.auth);

  return (
    <div className="flex items-center gap-2">
      <div className="h-9 w-9 flex-shrink-0">
        <img
          loading="lazy"
          className="object-cover h-full w-full border border-amber-300 rounded-full"
          src={currentUser?.imageUrl || defaultPP}
          alt="profile picture"
        />
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
