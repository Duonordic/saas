// lib/services/template-service.ts
import { Template, TemplateCategory } from "@/generated/prisma";
import prisma from "../prisma";

export class TemplateService {
  /**
   * Get all published templates
   */
  async listTemplates(filters?: {
    category?: TemplateCategory;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {
      is_published: true,
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { tags: { has: filters.search } },
      ];
    }

    const templates = await prisma.template.findMany({
      where,
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
      orderBy: [{ deploy_count: "desc" }, { created_at: "desc" }],
    });

    return templates;
  }

  /**
   * Get template by ID or slug
   */
  async getTemplate(idOrSlug: string): Promise<Template | null> {
    return prisma.template.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        is_published: true,
      },
    });
  }

  /**
   * Create a new template
   */
  async createTemplate(data: {
    slug: string;
    name: string;
    description: string;
    category: TemplateCategory;
    repo_url: string;
    repo_branch?: string;
    thumbnail_url?: string;
    demo_url?: string;
    config_schema?: any;
    default_env?: any;
    tags?: string[];
  }): Promise<Template> {
    return prisma.template.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        category: data.category,
        repo_url: data.repo_url,
        repo_branch: data.repo_branch || "main",
        thumbnail_url: data.thumbnail_url,
        demo_url: data.demo_url,
        config_schema: data.config_schema || {},
        default_env: data.default_env || {},
        tags: data.tags || [],
        is_published: false, // Start unpublished
      },
    });
  }

  /**
   * Update template
   */
  async updateTemplate(
    templateId: string,
    updates: Partial<Template>
  ): Promise<Template> {
    return prisma.template.update({
      where: { id: templateId },
      data: {
        ...updates,
        updated_at: new Date(),
      },
    });
  }

  /**
   * Publish template
   */
  async publishTemplate(templateId: string): Promise<Template> {
    return prisma.template.update({
      where: { id: templateId },
      data: { is_published: true },
    });
  }

  /**
   * Increment deploy count
   */
  async incrementDeployCount(templateId: string): Promise<void> {
    await prisma.template.update({
      where: { id: templateId },
      data: {
        deploy_count: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Get template with deployment stats
   */
  async getTemplateStats(templateId: string) {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        _count: {
          select: {
            deployments: true,
          },
        },
      },
    });

    if (!template) return null;

    const activeDeployments = await prisma.deployment.count({
      where: {
        template_id: templateId,
        status: "running",
      },
    });

    return {
      ...template,
      active_deployments: activeDeployments,
      total_deployments: template._count.deployments,
    };
  }

  /**
   * Search templates by tags
   */
  async searchByTags(tags: string[]): Promise<Template[]> {
    return prisma.template.findMany({
      where: {
        is_published: true,
        tags: {
          hasSome: tags,
        },
      },
    });
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(limit: number = 10): Promise<Template[]> {
    return prisma.template.findMany({
      where: { is_published: true },
      orderBy: { deploy_count: "desc" },
      take: limit,
    });
  }
}

export const templateService = new TemplateService();
