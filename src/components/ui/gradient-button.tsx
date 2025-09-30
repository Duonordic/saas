"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium font-space ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative group",
  {
    variants: {
      variant: {
        default: "bg-background hover:brightness/80",
        dark: "bg-background text-foreground hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        full: "h-full px-8",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
      radius: {
        default: "rounded-md",
        none: "rounded-none",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  }
);

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  alwaysOn?: boolean;
  animate?: boolean;
  inline?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      className,
      size,
      radius,
      variant = "default",
      alwaysOn = false,
      animate = false,
      asChild = false,
      inline = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const containerRef = React.useRef<HTMLDivElement>(null);
    const animationRef = React.useRef<number>(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const [gradientAngle, setGradientAngle] = React.useState(45);

    // Handle animation
    React.useEffect(() => {
      if (!animate || isHovered) {
        cancelAnimationFrame(animationRef.current);
        return;
      }

      const animateGradient = () => {
        setGradientAngle((prev) => (prev + 0.5) % 360);
        animationRef.current = requestAnimationFrame(animateGradient);
      };

      animationRef.current = requestAnimationFrame(animateGradient);

      return () => cancelAnimationFrame(animationRef.current);
    }, [animate, isHovered]);

    // Reset to 45deg smoothly on hover
    React.useEffect(() => {
      if (!animate || !isHovered) return;

      const targetAngle = 45;
      const startAngle = gradientAngle;
      const duration = 300;
      const startTime = performance.now();

      const animateTo45 = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing function
        const easedProgress =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        const newAngle =
          startAngle + (targetAngle - startAngle) * easedProgress;
        setGradientAngle(newAngle);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateTo45);
        }
      };

      animationRef.current = requestAnimationFrame(animateTo45);

      return () => cancelAnimationFrame(animationRef.current);
    }, [isHovered, animate, gradientAngle]);

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;

        containerRef.current.style.setProperty("--mouse-x", `${x}%`);
      },
      []
    );

    const handleMouseEnter = React.useCallback(() => {
      if (!containerRef.current) return;
      setIsHovered(true);

      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.setProperty("--gradient-opacity", "1");
        }
      });
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      if (!containerRef.current) return;
      setIsHovered(false);

      containerRef.current.style.setProperty("--mouse-x", "50%");
      if (alwaysOn) return;
      containerRef.current.style.setProperty("--gradient-opacity", "0");
    }, [alwaysOn]);

    const background = `linear-gradient(${gradientAngle}deg,
                var(--border) 0%,
                var(--border) calc(max(0%, var(--mouse-x, 50%) - 75%)),
                color-mix(in srgb, var(--chart-1) calc(var(--gradient-opacity, 0) * 100%), var(--border)) var(--mouse-x, 50%),
                var(--border) calc(min(100%, var(--mouse-x, 50%) + 75%)),
                var(--border) 100%)`;

    return (
      <div
        ref={containerRef}
        className={cn(
          "gradient-button__container",
          "duration-200",
          "p-px",
          {
            "rounded-md": radius === "default" || !radius,
            "rounded-full": radius === "pill",
          },
          {
            "inline-block": inline,
          }
        )}
        style={
          {
            "--gradient-opacity": alwaysOn ? "1" : "0",
            background,
            transition: animate ? "background 0.2s ease-out" : undefined,
          } as React.CSSProperties
        }
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Comp
          className={cn(
            buttonVariants({ variant, size, className }),
            !radius || (radius === "default" && "rounded"),
            radius === "pill" && "rounded-full"
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton, buttonVariants };
