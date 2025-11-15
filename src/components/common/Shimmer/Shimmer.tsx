import React from "react";
import "./shimmer.scss";

const Shimmer = ({
  animationDuration,
  width,
  height,
  fluid,
  verticlyFluid,
  className,
}: any) => {
  return (
    <span
      style={{
        width: fluid ? "100%" : width ? `${width}px` : "400px",
        height: verticlyFluid ? "100%" : height ? `${height}px` : "40px",
        animationDuration: animationDuration || "10s",
      }}
      className={`Shimmer ${className || ""}`}
    />
  );
};

export default Shimmer;
