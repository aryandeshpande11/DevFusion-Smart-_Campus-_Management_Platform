import React, { useState } from "react";
import { ScanLine } from "lucide-react";
import Button from "./Button";

// check-in input used by coordinators (event gate) and students (attendance
// self-mark) — accepts a pasted/typed code so it works even without camera
// access; swap in a camera scanner library later without touching callers
export default function QrScanInput({ onSubmitCode, isSubmitting, placeholder = "Scan or paste the code" }) {
  const [code, setCode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!code.trim()) return;
    onSubmitCode(code.trim());
    setCode("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <ScanLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          autoFocus
          className="fieldInput pl-9"
          placeholder={placeholder}
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
      </div>
      <Button type="submit" isLoading={isSubmitting}>
        Confirm
      </Button>
    </form>
  );
}
