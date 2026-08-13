import React from "react";

// circular initials avatar, falls back cleanly when there's no photo yet
export default function Avatar({ name = "", imageUrl, size = 40 }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-brand-500 text-sm font-medium text-white"
    >
      {initials || "?"}
    </div>
  );
}
