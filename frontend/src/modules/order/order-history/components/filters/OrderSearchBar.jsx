import React from "react";

function OrderSearchBar({
  searchValue,
  setSearchValue,
}) {
  return (
    <div>
      <div className="flex justify-end">
        <div
          className="
            hidden sm:flex
            items-center
            overflow-hidden
            rounded-xl
            border border-gray-700
            pl-2
            h-6
          "
        >
          <input
            type="text"
            value={searchValue}
            placeholder="Search Orders..."
            onChange={(e) =>
              setSearchValue(
                e.target.value
              )
            }
            className="
              h-6
              bg-transparent
              px-1
              text-xs
              font-semibold
              outline-none
            "
          />

          <div className="border-l border-black p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="gray"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSearchBar;
