import { cn } from "@/lib/utils";

interface SettingSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  isLast?: boolean;
}

export function SettingSection({
  title,
  description,
  children,
  className,
  isLast = false,
}: SettingSectionProps) {
  return (
    <div className={cn("border-l", !isLast && "border-b", className)}>
      <div className="p-4 bg-card/30 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
