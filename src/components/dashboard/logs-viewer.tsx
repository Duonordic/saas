// components/deployments/logs-viewer.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Download, Copy } from "lucide-react";
import { deploymentService } from "@/lib/services/deployment-service";

interface LogsViewerProps {
  deploymentId: string;
}

export async function LogsViewer({ deploymentId }: LogsViewerProps) {
  const logs = await deploymentService.getLogs(deploymentId);

  const getLogLevelColor = (line: string) => {
    if (line.includes("ERROR") || line.includes("error")) return "text-red-500";
    if (line.includes("WARN") || line.includes("warning"))
      return "text-yellow-500";
    if (line.includes("INFO") || line.includes("info")) return "text-blue-500";
    return "text-muted-foreground";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Deployment Logs</CardTitle>
            <CardDescription>
              Real-time build and deployment logs
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 rounded-md border">
          <div className="p-4 font-mono text-sm">
            {logs.split("\n").map((line, index) => (
              <div
                key={index}
                className={`${getLogLevelColor(line)} whitespace-pre-wrap`}
              >
                {line}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
