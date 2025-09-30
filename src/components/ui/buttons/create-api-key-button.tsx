"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export function CreateApiKeyButton() {
  const handleCreate = () => {
    console.log("Opening create API key dialog...");
  };

  return (
    <Button onClick={handleCreate} size="sm">
      <Bot />
      Create Key
    </Button>
  );
}
