import React from "react";
import { cn } from "@/lib/utils";

export default function AppInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "rounded-none flex h-9 w-full border border-input bg-background-dark hover:brightness-120 px-3 ring-0 outline-0 py-1 text-xs focus-visible:border-primary focus-visible:bg-background-light font-mono",
        className
      )}
      type={type}
      {...props}
    />
  );
}
