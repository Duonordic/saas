"use client";

import { Button } from "@/components/ui/button";

interface VerifyDomainButtonProps {
  domain: string;
}

export function VerifyDomainButton({ domain }: VerifyDomainButtonProps) {
  const handleVerify = () => {
    console.log("Verifying domain:", domain);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleVerify}>
      Verify Domain
    </Button>
  );
}
