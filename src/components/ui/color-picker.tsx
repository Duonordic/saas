"use client";

interface ColorPickerProps {
  id: string;
  name: string;
  defaultValue: string;
}

export function ColorPicker({ id, name, defaultValue }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="h-10 w-20 rounded-md border border-input cursor-pointer"
      />
      <input
        type="text"
        defaultValue={defaultValue}
        className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
      />
    </div>
  );
}
