interface SettingFieldProps {
  label: string;
  description?: string;
  htmlFor: string;
  children: React.ReactNode;
}

export function SettingField({
  label,
  description,
  htmlFor,
  children,
}: SettingFieldProps) {
  return (
    <div className="grid gap-3">
      <div>
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
