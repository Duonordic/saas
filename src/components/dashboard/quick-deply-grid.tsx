// components/dashboard/quick-deploy-grid.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { templateService } from "@/lib/services/template-service";
import { Rocket, ExternalLink, Box } from "lucide-react";
import Image from "next/image";

export async function QuickDeployGrid() {
  const templates = await templateService.getPopularTemplates(6);

  const getCategoryColor = (category: string) => {
    const colors = {
      ecommerce: "bg-purple-100 text-purple-800",
      blog: "bg-blue-100 text-blue-800",
      portfolio: "bg-green-100 text-green-800",
      saas: "bg-orange-100 text-orange-800",
      landing: "bg-pink-100 text-pink-800",
      dashboard: "bg-indigo-100 text-indigo-800",
      documentation: "bg-gray-100 text-gray-800",
      community: "bg-yellow-100 text-yellow-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Card className="bg-background-light">
      <CardHeader className="brightness-100">
        <CardTitle>Popular Templates</CardTitle>
        <CardDescription>
          Quick-deploy from our most popular templates
        </CardDescription>
      </CardHeader>
      <CardContent className="brightness-100">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {template.thumbnail_url ? (
                  /* TODO: Should use template.thumbnail_url */
                  <Image
                    src={"globe.svg"}
                    alt={template.name}
                    className="object-cover w-full h-full"
                    fill
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Box className="h-8 w-8" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {template.deploy_count} deploys
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getCategoryColor(template.category)}`}
                  >
                    {template.category}
                  </Badge>
                  <Button size="sm" className="h-7">
                    <Rocket className="h-3 w-3 mr-1" />
                    Deploy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
