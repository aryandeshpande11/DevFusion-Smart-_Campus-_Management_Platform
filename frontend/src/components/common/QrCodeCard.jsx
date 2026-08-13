import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "./Card";

// scannable pass shown for an event ticket or a live attendance session —
// pass whatever token/code the backend generated and a caption to show under it
export default function QrCodeCard({ value, caption, size = 180 }) {
  if (!value) return null;

  return (
    <Card className="flex flex-col items-center gap-3 text-center">
      <div className="rounded-xl border border-border bg-white p-4 dark:border-white/10">
        <QRCodeSVG value={value} size={size} bgColor="#ffffff" fgColor="#14231F" />
      </div>
      {caption && <p className="text-sm text-muted">{caption}</p>}
    </Card>
  );
}
