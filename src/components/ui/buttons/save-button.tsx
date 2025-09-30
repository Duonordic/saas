"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function SaveButton() {
  const handleSave = () => {
    console.log("Saving settings...");
  };

  return (
    <Button onClick={handleSave}>
      <Save className="w-4 h-4 mr-2" />
      Save Changes
    </Button>
  );
}
