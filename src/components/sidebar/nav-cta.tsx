import { Rocket, Sparkles } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { GradientButton } from "../ui/gradient-button";

interface NavCtaProps {
  title: string;
  description: string;
  actionText: string;
  variant?: "premium" | "upgrade" | "default";
  onAction: () => void;
  className?: string;
  visible?: boolean;
}

export function NavCta({
  title,
  description,
  actionText,
  variant = "default",
  onAction,
  className,
  visible = true,
}: NavCtaProps) {
  const { state } = useSidebar();

  const variants = {
    default:
      "bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20",
    premium: "bg-blue-500/5 border-blue-500/20",
    upgrade: "bg-green-500/5 border-green-500/20",
  };

  const iconColors = {
    default: "text-primary",
    premium: "text-blue-500",
    upgrade: "text-green-500",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg p-3 backdrop-blur-sm cursor-pointer group transition-all duration-300",
        variants[variant],
        {
          "opacity-100": state !== "collapsed",
          "opacity-0 scale-95 h-0 py-0": state === "collapsed",
        },
        visible ? "block" : "hidden",
        className
      )}
      onClick={onAction}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAction?.();
        }
      }}
    >
      <div className="relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-start space-x-2">
            <h4 className="text-sm font-semibold mb-1 leading-tight">
              {title}
            </h4>
            <div className="ml-auto">
              <Rocket className={cn("h-4 w-4", iconColors[variant])} />
            </div>
          </div>
          <p className="text-xs font-extralight text-sidebar-foreground/70 mb-2 leading-relaxed">
            {description}
          </p>

          <GradientButton alwaysOn animate size="sm" className="w-full">
            {actionText}
            <Sparkles className="ml-1 h-3 w-3" />
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
