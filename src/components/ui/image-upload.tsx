"use client";

import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
  id: string;
  currentImage?: string;
  aspectRatio: "logo" | "square";
}

export function ImageUpload({
  id,
  currentImage,
  aspectRatio,
}: ImageUploadProps) {
  return (
    <div className="flex items-center gap-4">
      {currentImage ? (
        <div className="relative border rounded-md p-2">
          <Image
            src={currentImage}
            alt="Upload preview"
            className={aspectRatio === "logo" ? "h-12" : "w-12 h-12"}
            fill
          />
          <button className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md flex items-center justify-center bg-muted/50 ${
            aspectRatio === "logo" ? "w-32 h-16" : "w-16 h-16"
          }`}
        >
          <Upload className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
      <Button variant="outline" size="sm">
        Upload Image
      </Button>
    </div>
  );
}
