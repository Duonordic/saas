// components/templates/template-browser.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { templateService } from "@/lib/services/template-service";
import { Search, Filter, Rocket, Star, Box } from "lucide-react";
import Image from "next/image";

export async function TemplateBrowser() {
  const templates = await templateService.listTemplates();
  const categories = [...new Set(templates.map((t) => t.category))];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="group bg-background">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {template.thumbnail_url ? (
                  /* TODO: Should use template.thumbnail_url */
                  <Image
                    src={"/globe.svg"}
                    alt={template.name}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Box className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-white bg-black/50 px-1 rounded">
                    {template.deploy_count}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{template.name}</h3>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex items-center justify-between pt-2">
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <Button size="sm" variant={"outline"}>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
