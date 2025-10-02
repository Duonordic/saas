"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Copy, Check, Upload, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AppInput from "@/components/ui/app-input"; // Assuming AppInput is in this path
import {
  GridRow,
  GridSpacer,
  GridSectionHeader,
  GridDecorative,
} from "@/components/ui/grid"; // Assuming Grid components are in this path
import { SettingSection } from "./settings-section"; // Using the SettingSection component provided
import { Button } from "@/components/ui/button"; // Assuming a Button component exists

// Define the structure for a CSS Variable
interface CSSVariable {
  name: string;
  value: string; // This will store the OKLCH (L C H) or radius (e.g., 0.5rem) value
  description: string;
  category: "colors" | "radius";
}

interface CSSVariablesEditorProps {
  defaultValues?: Record<string, string>;
  className?: string;
}

// Default variables using OKLCH Light Mode values (L C H components)
// These values are based on a typical shadcn setup but use the L C H format.
const defaultCSSVariables: CSSVariable[] = [
  // Colors (OKLCH values: L C H string)
  {
    name: "--background",
    value: "100% 0 0",
    description: "Background",
    category: "colors",
  },
  {
    name: "--foreground",
    value: "22.7% 0 0",
    description: "Foreground",
    category: "colors",
  },
  {
    name: "--card",
    value: "100% 0 0",
    description: "Card",
    category: "colors",
  },
  {
    name: "--card-foreground",
    value: "22.7% 0 0",
    description: "Card Foreground",
    category: "colors",
  },
  {
    name: "--popover",
    value: "100% 0 0",
    description: "Popover",
    category: "colors",
  },
  {
    name: "--popover-foreground",
    value: "22.7% 0 0",
    description: "Popover Foreground",
    category: "colors",
  },
  {
    name: "--primary",
    value: "58.6% 0.231 292.3",
    description: "Primary",
    category: "colors",
  },
  {
    name: "--primary-foreground",
    value: "96.7% 0 0",
    description: "Primary Foreground",
    category: "colors",
  },
  {
    name: "--secondary",
    value: "95% 0.007 270",
    description: "Secondary",
    category: "colors",
  },
  {
    name: "--secondary-foreground",
    value: "22.7% 0 0",
    description: "Secondary Foreground",
    category: "colors",
  },
  {
    name: "--muted",
    value: "95% 0.007 270",
    description: "Muted",
    category: "colors",
  },
  {
    name: "--muted-foreground",
    value: "50% 0 0",
    description: "Muted Foreground",
    category: "colors",
  },
  {
    name: "--accent",
    value: "95% 0.007 270",
    description: "Accent",
    category: "colors",
  },
  {
    name: "--accent-foreground",
    value: "22.7% 0 0",
    description: "Accent Foreground",
    category: "colors",
  },
  {
    name: "--destructive",
    value: "65% 0.25 25",
    description: "Destructive",
    category: "colors",
  },
  {
    name: "--destructive-foreground",
    value: "96.7% 0 0",
    description: "Destructive Foreground",
    category: "colors",
  },
  {
    name: "--border",
    value: "90% 0.005 270",
    description: "Border",
    category: "colors",
  },
  {
    name: "--input",
    value: "90% 0.005 270",
    description: "Input",
    category: "colors",
  },
  {
    name: "--ring",
    value: "22.7% 0 0",
    description: "Ring",
    category: "colors",
  },
  // Radius
  {
    name: "--radius",
    value: "0.5rem",
    description: "Border Radius",
    category: "radius",
  },
];

/**
 * Parses CSS content to extract variable values from a :root or .dark selector.
 * It's designed to accept L C H or other string values.
 */
const parseCssFile = (
  cssContent: string,
  currentVariables: CSSVariable[]
): Record<string, string> => {
  // Regex to find content inside :root or .dark blocks
  const rootRegex = /:root\s*\{([^}]+)\}/;
  const darkRegex = /\.dark\s*\{([^}]+)\}/;
  // Regex to find CSS variable and its value (allowing any characters inside the value up to the semicolon)
  const varRegex = /(--[\w-]+):\s*([^;]+);/g;

  const matches = cssContent.match(rootRegex) || cssContent.match(darkRegex);
  const newValues: Record<string, string> = {};

  if (matches && matches[1]) {
    let match;
    while ((match = varRegex.exec(matches[1])) !== null) {
      const varName = match[1].trim();
      const varValue = match[2].trim();
      // Only extract variables that are in our default list
      if (currentVariables.some((v) => v.name === varName)) {
        newValues[varName] = varValue;
      }
    }
  }

  return newValues;
};

export function CSSVariablesEditor({
  defaultValues,
  className,
}: CSSVariablesEditorProps) {
  const initialVariables = useMemo(
    () =>
      defaultCSSVariables.map((v) => ({
        ...v,
        // Apply defaultValues if provided, otherwise use the variable's default
        value: defaultValues?.[v.name] || v.value,
      })),
    [defaultValues]
  );

  const [variables, setVariables] = useState<CSSVariable[]>(initialVariables);
  const [copied, setCopied] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const colorVariables = variables.filter((v) => v.category === "colors");
  const radiusVariables = variables.filter((v) => v.category === "radius");

  const handleChange = (name: string, value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.name === name ? { ...v, value } : v))
    );
  };

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Reset message
      setUploadMessage(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const cssContent = e.target?.result as string;
          // Parse the CSS, checking against the default set of variables
          const newValues = parseCssFile(cssContent, defaultCSSVariables);

          if (Object.keys(newValues).length > 0) {
            setVariables((prev) =>
              prev.map((v) => ({
                ...v,
                value:
                  newValues[v.name] !== undefined ? newValues[v.name] : v.value,
              }))
            );
            setUploadMessage(
              `Successfully populated ${
                Object.keys(newValues).length
              } variables.`
            );
          } else {
            setUploadMessage(
              "No recognizable shadcn variables found in the uploaded CSS file (looking for :root or .dark blocks)."
            );
          }
        } catch (error) {
          console.error("Error reading or parsing CSS file:", error);
          setUploadMessage("Failed to read or parse the CSS file.");
        }
        // Reset file input value to allow re-uploading the same file
        event.target.value = "";
        setTimeout(() => setUploadMessage(null), 5000);
      };
      reader.onerror = () => {
        setUploadMessage("Error reading file.");
        setTimeout(() => setUploadMessage(null), 5000);
      };
      reader.readAsText(file);
    },
    []
  );

  const resetVariables = () => {
    setVariables(initialVariables);
    setUploadMessage("Variables reset to default OKLCH values.");
    setTimeout(() => setUploadMessage(null), 3000);
  };

  const generateCSS = () => {
    // Generate the CSS using the OKLCH function and the stored L C H values
    return `@layer base {
  :root {
${colorVariables
  .map((v) => `    ${v.name}: ${v.value}; /* oklch(L C H) */`)
  .join("\n")}
${radiusVariables.map((v) => `    ${v.name}: ${v.value};`).join("\n")}
  }
  
  .dark {
    /* Dark mode variables would be defined here */
  }
}`;
  };

  const copyToClipboard = () => {
    // We use the temporary clipboard method since navigator.clipboard might fail in iframes
    const cssContent = generateCSS();
    const textArea = document.createElement("textarea");
    textArea.value = cssContent;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback message if copy fails
      setUploadMessage("Failed to copy. Try selecting and copying manually.");
      setTimeout(() => setUploadMessage(null), 5000);
    }
    document.body.removeChild(textArea);
  };

  // --- Render logic using Grid Components ---
  return (
    <div className={cn("flex-1 min-h-0", className)}>
      <SettingSection
        title="Custom Properties"
        description="Configure the OKLCH color values and sizing of your components using CSS variables. These settings are applied immediately to your app's preview."
      >
        {/* Upload/Reset Actions */}
        <GridSpacer />
        <GridRow
          label="Import Configuration"
          description="Upload an existing CSS file to automatically populate your variables or reset to the OKLCH defaults."
          columns={2}
          labelSpan={1}
          isFirst
        >
          <div className="flex gap-2">
            <label
              htmlFor="css-upload"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-none border border-input bg-background-dark hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <Upload className="w-3 h-3 text-primary" />
              Upload CSS
            </label>
            <input
              id="css-upload"
              type="file"
              accept=".css"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={resetVariables}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-none border border-input bg-background-dark hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
              Reset to Defaults
            </Button>
          </div>
        </GridRow>
        {uploadMessage && (
          <GridRow
            label="Status"
            description="Last operation status."
            columns={2}
            labelSpan={1}
          >
            <div
              className={cn(
                "text-xs",
                uploadMessage.includes("Successfully")
                  ? "text-green-500"
                  : "text-destructive"
              )}
            >
              {uploadMessage}
            </div>
          </GridRow>
        )}
        <GridSpacer />

        {/* Color Variables Section */}
        <GridSectionHeader>Color Variables (oklch(L C H))</GridSectionHeader>

        {colorVariables.map((variable, index) => (
          <GridRow
            key={variable.name}
            label={variable.description}
            description={variable.name}
            columns={2}
            labelSpan={1}
            isFirst={index === 0}
            withoutPadding
          >
            <div className="grid h-20 grid-cols-[1rem_1fr_1rem] grid-rows-[0.75rem_1fr_0.75rem]">
              <div className="border-x border-dashed col-start-2 col-end-2 border-border/20" />
              <div className="border-x border-dashed row-start-3 row-end-3 col-start-2 col-end-2 border-border/20" />
              <div className="border-y border-dashed row-start-2 row-end-2 border-border/20" />
              <div className="border flex items-center row-start-2 row-end-2 border-border/20">
                <AppInput
                  type="text"
                  id={variable.name}
                  name={variable.name}
                  value={variable.value}
                  onChange={(e) => handleChange(variable.name, e.target.value)}
                  placeholder="L C H (e.g., 50% 0.1 240)"
                  className="flex-1 -mx-px"
                />
                {/* Color Swatch using the OKLCH CSS function */}
                <div
                  className="w-12 h-9 border-l-0 border border-input shrink-0 shadow-inner"
                  style={{
                    backgroundColor: `oklch(${variable.value
                      .split(" ")
                      .slice(0, 3)
                      .join(" ")})`,
                  }}
                  title={`oklch(${variable.value})`}
                />
              </div>
              <div className="border-y border-dashed row-start-2 row-end-2 border-border/20" />
            </div>
          </GridRow>
        ))}

        <GridSpacer />

        {/* Radius Variables Section */}
        <GridSectionHeader>Border Radius</GridSectionHeader>

        {radiusVariables.map((variable, index) => (
          <GridRow
            key={variable.name}
            label={variable.description}
            description={variable.name}
            columns={2}
            labelSpan={1}
            isFirst={index === 0}
            withoutPadding
          >
            <div className="grid h-20 grid-cols-[1rem_1fr_1rem] grid-rows-[0.75rem_1fr_0.75rem]">
              <div className="border-x border-dashed col-start-2 col-end-2 border-border/20" />
              <div className="border-x border-dashed row-start-3 row-end-3 col-start-2 col-end-2 border-border/20" />
              <div className="border-y border-dashed row-start-2 row-end-2 border-border/20" />
              <div className="border flex items-center row-start-2 row-end-2 border-border/20">
                <AppInput
                  type="text"
                  id={variable.name}
                  name={variable.name}
                  value={variable.value}
                  onChange={(e) => handleChange(variable.name, e.target.value)}
                  placeholder="e.g., 0.5rem or 0px"
                  className="font-sans"
                />
              </div>
              <div className="border-y border-dashed row-start-2 row-end-2 border-border/20" />
            </div>
          </GridRow>
        ))}

        <GridSpacer />

        {/* Action/Preview Section */}
        <GridSectionHeader>Export</GridSectionHeader>

        <GridRow
          label="Generated CSS"
          description="Copy the full CSS content for your theme. This is automatically saved in the app."
          columns={2}
          labelSpan={1}
          withoutPadding
        >
          <div className="mx-4 border-x border-dashed border-border/30">
            <div className="flex flex-col">
              <GridDecorative pattern="diagonal" />
              <pre className="text-[10px] bg-background-light p-2 border-y border-dashed border-border/30 overflow-auto max-h-48 whitespace-pre-wrap font-mono rounded-none">
                {generateCSS()}
              </pre>
              <Button
                type="button"
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-none border-border/30 border-x-0 -mt-px w-full"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy CSS
                  </>
                )}
              </Button>
              <GridDecorative pattern="diagonal" />
            </div>
          </div>
        </GridRow>

        <GridSpacer isFirst={false} />
      </SettingSection>
    </div>
  );
}
