"use client";

import { Switch } from "./switch";

interface ClientToggleProps {
  id: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}

export function ClientToggle({
  id,
  label,
  description,
  defaultChecked,
}: ClientToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-2">
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );
}
