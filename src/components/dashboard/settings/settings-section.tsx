interface SettingSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SettingSection({
  title,
  description,
  children,
}: SettingSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="space-y-6 border-l-2 pl-6">{children}</div>
    </div>
  );
}
