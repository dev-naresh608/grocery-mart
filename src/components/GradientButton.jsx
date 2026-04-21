import React from "react";
import { Link } from "react-router-dom";


function GradientButton({
  componentType = "button",
  children,
  size = "default",
  to,
  target,
  onClick = () => {},
  className,
}) {
  const sizes = {
    sm: "sm",
    default: "md",
    lg: "2xl",
  };
  if (componentType === "Link") {
    return (
      <>
        <Link
          to={to}
          size={sizes.size}
          className={`bg-gradient-to-r font-semibold from-green-600 to-green-300 px-3 py-1 rounded-2xl whitespace-nowrap text-${sizes[size]} ${className}`}
        >
          {children}
        </Link>
      </>
    );
  } else if (componentType === "text") {
    return (
      <p
        size={sizes.size}
        className={`bg-gradient-to-r font-semibold from-green-600 to-green-300 px-3 py-1 rounded-2xl whitespace-nowrap text-${sizes[size]} ${className}`}
      >
        {children}
      </p>
    );
  } else if (componentType === "a") {
   return <a
      href={to}
      size={sizes.size}
      target={target}
      className={`bg-gradient-to-r font-semibold from-green-600 to-green-300 px-3 py-1 rounded-2xl whitespace-nowrap text-${sizes.size} ${className}`}
    >
      {children}
    </a>;
  } else {
    return (
      <>
        <button
          onClick={onClick}
          size={sizes.size}
          className={`bg-gradient-to-r font-semibold from-green-600 to-green-300 px-3 py-1 rounded-2xl whitespace-nowrap text-${sizes.size} ${className}`}
        >
          {children}
        </button>
      </>
    );
  }
}

export default GradientButton;
