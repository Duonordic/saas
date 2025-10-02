"use client";
import React from "react";
import { cn } from "@/lib/utils";

/**
 * Grid Layout Components for Settings Pages
 * These components provide a consistent grid-based layout system
 */

// Vertical spacer with side borders
export function GridSpacer({
  className,
  isFirst = false,
}: {
  className?: string;
  isFirst?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-4 mx-4 border-x border-dashed border-border/50",
        className,
        isFirst && "border-b"
      )}
    />
  );
}

// Content card with standard borders
export function GridCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-y px-4 border-t-dashed border-border/50",
        className
      )}
    >
      <div className="p-4 border-x border-dashed bg-background border-border">
        {children}
      </div>
    </div>
  );
}

// Row with label and content in grid layout
export function GridRow({
  label,
  description,
  children,
  columns = 3,
  labelSpan = 1,
  isFirst = false,
  withoutPadding = false,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  columns?: 2 | 3;
  labelSpan?: 1 | 2;
  isFirst?: boolean;
  withoutPadding?: boolean;
}) {
  const contentSpan = columns - labelSpan;

  return (
    <div
      className={cn("border-border/50 border-b px-4", isFirst && "border-t")}
    >
      <div
        className={cn(
          "grid border-border/50 border-x border-dashed",
          `grid-cols-${columns}`
        )}
      >
        <div
          className={cn(
            "p-4 bg-background-dark border-r border-dashed border-border/50",
            labelSpan === 2 && "col-span-2"
          )}
        >
          <div className="text-sm font-medium mb-1">{label}</div>
          {description && (
            <div className="text-xs text-muted-foreground">{description}</div>
          )}
        </div>
        <div
          className={cn(
            "bg-background",
            contentSpan === 2 && "col-span-2",
            withoutPadding ? "p-0" : "p-4"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// List container with dividers
export function GridList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-y px-4 border-dashed divide-y divide-dashed border-border/50",
        className
      )}
    >
      {children}
    </div>
  );
}

// List item with borders
export function GridListItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-x border-dashed bg-background-dark border-border/50",
        className
      )}
    >
      {children}
    </div>
  );
}

// Stats grid for displaying metrics
export function GridStats({
  children,
  columns = 3,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}) {
  return (
    <div className="border-y px-4 border-t-dashed border-border/50">
      <div
        className={cn(
          "grid gap-px bg-border border-x border-dashed",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-3",
          columns === 4 && "grid-cols-4"
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Individual stat item
export function GridStatItem({
  label,
  value,
  subtitle,
  children,
}: {
  label?: string;
  value?: string | number;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-background">
      {children ? (
        children
      ) : (
        <>
          {label && (
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
          )}
          {value !== undefined && (
            <div className="text-2xl font-semibold">{value}</div>
          )}
          {subtitle && (
            <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
          )}
        </>
      )}
    </div>
  );
}

// Context to share column configuration
const GridTableContext = React.createContext<{
  columnCount: number;
  colTemplate: string;
}>({
  columnCount: 0,
  colTemplate: "",
});

// Table-like grid structure
export function GridTable({
  headers,
  children,
  className,
  customColTemplate,
}: {
  headers: string[];
  children: React.ReactNode;
  className?: string;
  customColTemplate?: string; // Override automatic column template if needed
}) {
  const columnCount = headers.length;
  const colTemplate = customColTemplate || headers.map(() => "1fr").join(" ");

  return (
    <GridTableContext.Provider value={{ columnCount, colTemplate }}>
      <div className={cn("border-y px-4 border-t-dashed", className)}>
        <div className="border-x border-dashed divide-y divide-dashed">
          {/* Header Row - NOW USES colTemplate */}
          <div
            className="grid gap-px bg-border"
            style={{ gridTemplateColumns: colTemplate }}
          >
            {headers.map((header, i) => (
              <div
                key={i}
                className="p-3 bg-background-dark text-xs font-medium text-muted-foreground"
              >
                {header}
              </div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </GridTableContext.Provider>
  );
}

// Table row with automatic column matching
export function GridTableRow({
  children,
  className,
  style,
  ignoreColumnCheck = false,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ignoreColumnCheck?: boolean; // Set to true to bypass validation
}) {
  const { columnCount, colTemplate } = React.useContext(GridTableContext);

  // Validate that the number of children matches the header count
  if (!ignoreColumnCheck && process.env.NODE_ENV !== "production") {
    const childCount = React.Children.count(children);
    if (childCount !== columnCount) {
      console.warn(
        `GridTableRow: Expected ${columnCount} cells to match headers, but received ${childCount} cells.`
      );
    }
  }

  return (
    <div
      style={{ ...style, gridTemplateColumns: colTemplate }}
      className={cn("grid gap-px bg-border", className)}
    >
      {children}
    </div>
  );
}

// Table cell
export function GridTableCell({
  children,
  className,
  colSpan = 1,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number; // Allow cells to span multiple columns
}) {
  return (
    <div
      className={cn("p-3 bg-background", className)}
      style={colSpan > 1 ? { gridColumn: `span ${colSpan}` } : undefined}
    >
      {children}
    </div>
  );
}

// Helper component for empty cells
export function GridTableEmptyCell({ className }: { className?: string }) {
  return (
    <GridTableCell className={cn("text-muted-foreground", className)}>
      —
    </GridTableCell>
  );
}

// Section header (light background)
export function GridSectionHeader({
  children,
  className,
  isFirst = false,
}: {
  children: React.ReactNode;
  className?: string;
  isFirst?: boolean;
}) {
  return (
    <div className={cn(isFirst && "border-t border-dashed border-border/50")}>
      <div
        className={cn(
          "bg-background-light mx-4 pl-4 py-2 border-x border-border/50",
          className,
          isFirst && "border-t -mt-px"
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Empty decorative cell with pattern
export function GridDecorative({
  pattern = "crosshatch",
  className,
  children,
}: {
  pattern?: "crosshatch" | "dots" | "diagonal";
  className?: string;
  children?: React.ReactNode;
}) {
  const patterns = {
    crosshatch: `repeating-linear-gradient(
      45deg,
      currentColor,
      currentColor 1px,
      transparent 1px,
      transparent 10px
    ),
    repeating-linear-gradient(
      -45deg,
      currentColor,
      currentColor 1px,
      transparent 1px,
      transparent 10px
    )`,
    dots: `radial-gradient(circle, var(--primary) 2px, transparent 1px)`,
    diagonal: `repeating-linear-gradient(
      45deg,
      currentColor,
      currentColor 1px,
      transparent 1px,
      transparent 8px
    )`,
  };

  return (
    <div
      className={cn(
        "p-4 bg-background relative overflow-hidden flex items-center justify-center",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: patterns[pattern] }}
      />
      {children}
    </div>
  );
}
