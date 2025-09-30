"use client";

import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function InviteUserButton() {
  const handleInvite = () => {
    console.log("Opening invite dialog...");
  };

  return (
    <Button onClick={handleInvite} size="sm">
      <UserPlus className="w-4 h-4 mr-2" />
      Invite Member
    </Button>
  );
}
