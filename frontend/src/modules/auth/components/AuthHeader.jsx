import React from "react";

function AuthHeader({ icon: HeaderIcon, title, subtitle }) {
  return (
    <div className="text-black flex flex-col items-center gap-3 mb-5">
      <div className="bg-black rounded-2xl h-14 w-14 flex items-center justify-center">
        {HeaderIcon && <HeaderIcon className="text-white" />}
      </div>
      <div>
        <p className="font-bold text-2xl"> {title}</p>
        <p className="text-gray-700">{subtitle}</p>
      </div>
    </div>
  );
}

export default AuthHeader;
