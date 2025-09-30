// app/dashboard/templates/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { templateService } from "@/lib/services/template-service";
import Image from "next/image";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateBrowser } from "@/components/dashboard/template-browser";

export default async function TemplatesPage() {
  const popularTemplates = await templateService.getPopularTemplates(3);
  const totalTemplates = await templateService.listTemplates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground">
          Choose from our curated collection of Next.js templates
        </p>
      </div>

      {/* Featured Templates */}
      <Card className="bg-transparent border-0 shadow-none p-0">
        <CardHeader className="bg-card rounded-md py-4 border">
          <CardTitle>Featured Templates</CardTitle>
          <CardDescription>
            Most popular templates to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid gap-4 md:grid-cols-3">
            {popularTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                  {template.thumbnail_url ? (
                    /* TODO: Should use template.thumbnail_url */
                    <Image
                      src={"/globe.svg"}
                      alt={template.name}
                      className="object-cover w-full h-full"
                      height={40}
                      width={60}
                    />
                  ) : (
                    <div className="text-muted-foreground">
                      <Box className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{template.name}</h3>
                  <Badge variant="secondary">{template.deploy_count}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{template.category}</Badge>
                  <Button size="sm">Deploy</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Template Browser */}
      <TemplateBrowser />
    </div>
  );
}
