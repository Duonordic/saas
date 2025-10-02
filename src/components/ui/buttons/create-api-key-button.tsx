"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export function CreateApiKeyButton() {
  const handleCreate = () => {
    console.log("Opening create API key dialog...");
  };

  return (
    <Button
      className="rounded-none bg-primary/20 border-l h-9"
      onClick={handleCreate}
      size="sm"
    >
      <Bot />
      Create New Key
    </Button>
  );
}
