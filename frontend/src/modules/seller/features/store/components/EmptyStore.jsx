import React from "react";

function EmptyStore({searchQuery}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center w-full col-span-full">
      <h2 className="text-lg font-semibold text-gray-600">
        No Stores Found 
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        {searchQuery
          ? `There are no stores available matching "${searchQuery}".`
          : "There are no stores available."}
      </p>
    </div>
  );
}

export default EmptyStore;
