"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { PropsWithChildren } from "react";

interface ClientButtonProps {
  onClick: () => void;
}

export function ClientButton({
  onClick,
  children,
  variant,
  size,
}: PropsWithChildren<ClientButtonProps> & VariantProps<typeof buttonVariants>) {
  return (
    <Button variant={variant} size={size} onClick={onClick}>
      {children}
    </Button>
  );
}
