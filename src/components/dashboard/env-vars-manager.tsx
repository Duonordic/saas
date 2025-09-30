// components/deployments/env-vars-manager.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface EnvVarsManagerProps {
  initialVars: Record<string, string>;
  deploymentId: string;
}

export function EnvVarsManager({
  initialVars,
  deploymentId,
}: EnvVarsManagerProps) {
  const [envVars, setEnvVars] = useState<
    { key: string; value: string; isSecret: boolean }[]
  >(
    Object.entries(initialVars).map(([key, value]) => ({
      key,
      value,
      isSecret:
        key.toLowerCase().includes("secret") ||
        key.toLowerCase().includes("key") ||
        key.toLowerCase().includes("token"),
    }))
  );
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());

  const addVariable = () => {
    setEnvVars([...envVars, { key: "", value: "", isSecret: false }]);
  };

  const removeVariable = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const updateVariable = (
    index: number,
    field: "key" | "value" | "isSecret",
    value: string | boolean
  ) => {
    const updated = [...envVars];
    updated[index] = { ...updated[index], [field]: value };
    setEnvVars(updated);
  };

  const toggleSecretVisibility = (key: string) => {
    const updated = new Set(visibleSecrets);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }
    setVisibleSecrets(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
        <CardDescription>
          Configure environment variables for your deployment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {envVars.map((env, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1 grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Input
                  placeholder="Variable name"
                  value={env.key}
                  onChange={(e) => updateVariable(index, "key", e.target.value)}
                />
              </div>
              <div className="col-span-7">
                <div className="relative">
                  <Input
                    type={
                      env.isSecret && !visibleSecrets.has(env.key)
                        ? "password"
                        : "text"
                    }
                    placeholder="Variable value"
                    value={env.value}
                    onChange={(e) =>
                      updateVariable(index, "value", e.target.value)
                    }
                  />
                  {env.isSecret && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleSecretVisibility(env.key)}
                    >
                      {visibleSecrets.has(env.key) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={env.isSecret}
                  onChange={(e) =>
                    updateVariable(index, "isSecret", e.target.checked)
                  }
                  className="mr-2"
                />
                <Label className="text-xs">Secret</Label>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeVariable(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={addVariable}>
            <Plus className="h-4 w-4 mr-2" />
            Add Variable
          </Button>
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
