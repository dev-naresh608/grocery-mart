import React, { useState } from "react";

function ProductImageLoader({ src, name }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <>
      <div className="relative w-[120px] h-[120px] flex items-center justify-center">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={src}
          alt={name}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          className={`object-contain w-[120px] h-[120px] transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"} `}
        />
      </div>
    </>
  );
}

export default ProductImageLoader;


