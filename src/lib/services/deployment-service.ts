// lib/services/deployment-service.ts
// REFACTORED FOR VERCEL
import { Deployment, DeploymentStatus } from "@/generated/prisma";
import { vercelDeployer, VercelDeployer } from "./vercel-deployer";
import { templateService } from "./template-service";
import prisma from "../prisma";

interface DeploymentRequest {
  tenantId: string;
  templateId: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  envVars?: Record<string, string>;
  buildConfig?: {
    framework?: string;
    buildCommand?: string;
    outputDirectory?: string;
    installCommand?: string;
  };
}

interface DeploymentMetrics {
  status: string;
  url: string;
  readyState: string;
  createdAt: Date;
  deploymentId: string;
}

export class DeploymentService {
  /**
   * Deploy a new application for a tenant using Vercel
   */
  async deploy(request: DeploymentRequest): Promise<Deployment> {
    // 1. Validate template exists
    const template = await templateService.getTemplate(request.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // 2. Validate subdomain is available
    await this.validateSubdomain(request.subdomain);

    // 3. Validate custom domain if provided
    if (request.customDomain) {
      await this.validateCustomDomain(request.customDomain);
    }

    // 4. Parse Git repository information
    const gitSource = VercelDeployer.parseGitUrl(template.repo_url);

    // 5. Prepare environment variables
    const envVars = {
      ...(template.default_env as Record<string, string>),
      ...request.envVars,
      NEXT_PUBLIC_APP_NAME: request.name,
      NEXT_PUBLIC_TENANT_ID: request.tenantId,
      NEXT_PUBLIC_DEPLOYMENT_URL: `https://${request.subdomain}.vercel.app`,
    };

    // 6. Create deployment record in pending state
    const deployment = await prisma.deployment.create({
      data: {
        tenant_id: request.tenantId,
        template_id: request.templateId,
        name: request.name,
        subdomain: request.subdomain,
        custom_domain: request.customDomain,
        status: DeploymentStatus.pending,
        env_vars: envVars,
        build_config: request.buildConfig || {},
        vercel_deployment_id: "temp-" + Date.now(), // Temporary, will be updated
        ssl_enabled: true, // Vercel handles SSL automatically
      },
    });

    // 7. Trigger Vercel deployment (asynchronous)
    try {
      const vercelDeployment = await vercelDeployer.createDeployment({
        name: this.getVercelProjectName(request.subdomain),
        gitSource: {
          type: gitSource.type,
          repo: gitSource.repo,
          ref: template.repo_branch,
        },
        env: envVars,
        projectSettings: request.buildConfig,
      });

      // 8. Update deployment with Vercel ID
      const updatedDeployment = await prisma.deployment.update({
        where: { id: deployment.id },
        data: {
          vercel_deployment_id: vercelDeployment.id,
          status: this.mapVercelStatus(vercelDeployment.state),
          deployment_url: `https://${vercelDeployment.url}`,
          preview_url: `https://${vercelDeployment.url}`,
        },
      });

      // 9. Assign custom domain if provided
      if (request.customDomain) {
        await vercelDeployer
          .assignDomain(
            this.getVercelProjectName(request.subdomain),
            request.customDomain
          )
          .catch((error) => {
            console.error("Failed to assign custom domain:", error);
            // Don't fail the deployment if domain assignment fails
          });
      }

      // 10. Increment template deploy count
      await templateService.incrementDeployCount(request.templateId);

      // 11. Log the deployment activity
      await this.logDeploymentActivity(
        request.tenantId,
        `Deployed ${request.name} using template ${template.name}`,
        deployment.id
      );

      return updatedDeployment;
    } catch (error) {
      // Update deployment status if Vercel API call fails immediately
      await prisma.deployment.update({
        where: { id: deployment.id },
        data: {
          status: DeploymentStatus.failed,
          error_message:
            error instanceof Error ? error.message : "Deployment failed",
        },
      });
      throw error;
    }
  }

  /**
   * Get all deployments for a tenant
   */
  async listDeployments(tenantId: string, includeDeleted: boolean = false) {
    return prisma.deployment.findMany({
      where: {
        tenant_id: tenantId,
        ...(includeDeleted ? {} : { deleted_at: null }),
      },
      include: {
        template: {
          select: {
            name: true,
            slug: true,
            category: true,
            thumbnail_url: true,
            version: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Get deployment by ID
   */
  async getDeployment(deploymentId: string): Promise<Deployment | null> {
    return prisma.deployment.findUnique({
      where: { id: deploymentId },
      include: {
        template: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            domain: true,
          },
        },
      },
    });
  }

  /**
   * Stop/Cancel a deployment
   */
  async stopDeployment(deploymentId: string): Promise<Deployment> {
    const deployment = await this.getDeployment(deploymentId);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    // Note: Vercel doesn't have a "stop" concept - deployments are immutable
    // You would typically just delete it
    const updatedDeployment = await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: DeploymentStatus.stopped,
      },
    });

    await this.logDeploymentActivity(
      deployment.tenant_id,
      `Stopped deployment: ${deployment.name}`,
      deploymentId
    );

    return updatedDeployment;
  }

  /**
   * Redeploy (create a new deployment)
   */
  async redeploy(deploymentId: string): Promise<Deployment> {
    const deployment = await this.getDeployment(deploymentId);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    // Create a new deployment with the same configuration
    return this.deploy({
      tenantId: deployment.tenant_id,
      templateId: deployment.template_id,
      name: deployment.name,
      subdomain: deployment.subdomain,
      customDomain: deployment.custom_domain || undefined,
      envVars: deployment.env_vars as Record<string, string>,
      buildConfig: deployment.build_config as any,
    });
  }

  /**
   * Update deployment environment variables (requires rebuild)
   */
  async updateEnvironment(
    deploymentId: string,
    newEnvVars: Record<string, string>
  ): Promise<Deployment> {
    const deployment = await this.getDeployment(deploymentId);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    // Update env vars in database
    const updatedDeployment = await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        env_vars: {
          ...(deployment.env_vars as Record<string, string>),
          ...newEnvVars,
        },
      },
    });

    // Trigger redeploy with new env vars
    await this.redeploy(deploymentId);

    await this.logDeploymentActivity(
      deployment.tenant_id,
      `Updated environment variables for: ${deployment.name}`,
      deploymentId
    );

    return updatedDeployment;
  }

  /**
   * Get deployment logs from Vercel
   */
  async getLogs(deploymentId: string): Promise<string> {
    const deployment = await this.getDeployment(deploymentId);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    try {
      const logs = await vercelDeployer.getDeploymentLogs(
        deployment.vercel_deployment_id
      );
      return logs.join("\n");
    } catch (error) {
      return `Failed to fetch logs: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
    }
  }

  /**
   * Get deployment status from Vercel
   */
  async syncDeploymentStatus(deploymentId: string): Promise<Deployment> {
    const deployment = await this.getDeployment(deploymentId);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    try {
      const vercelDeployment = await vercelDeployer.getDeploymentStatus(
        deployment.vercel_deployment_id
      );

      return prisma.deployment.update({
        where: { id: deploymentId },
        data: {
          status: this.mapVercelStatus(vercelDeployment.state),
          deployment_url: `https://${vercelDeployment.url}`,
          last_deployed_at:
            vercelDeployment.state === "READY" ? new Date() : undefined,
        },
      });
    } catch (error) {
      throw new Error(
        `Failed to sync deployment status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete a deployment
   */
  async deleteDeployment(deploymentId: string): Promise<void> {
    const deployment = await this.getDeployment(deploymentId);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    // Soft delete in our database
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        deleted_at: new Date(),
        status: DeploymentStatus.deleting,
      },
    });

    // Delete from Vercel
    try {
      await vercelDeployer.deleteDeployment(deployment.vercel_deployment_id);

      // Remove custom domain if exists
      if (deployment.custom_domain) {
        await vercelDeployer
          .removeDomain(
            this.getVercelProjectName(deployment.subdomain),
            deployment.custom_domain
          )
          .catch(() => {
            // Ignore errors
          });
      }
    } catch (error) {
      console.error("Failed to delete from Vercel:", error);
      // Continue even if Vercel deletion fails
    }

    await this.logDeploymentActivity(
      deployment.tenant_id,
      `Deleted deployment: ${deployment.name}`,
      deploymentId
    );
  }

  /**
   * Get deployment metrics (from Vercel)
   */
  async getMetrics(deploymentId: string): Promise<DeploymentMetrics | null> {
    const deployment = await this.getDeployment(deploymentId);
    if (!deployment) {
      return null;
    }

    try {
      const vercelDeployment = await vercelDeployer.getDeploymentStatus(
        deployment.vercel_deployment_id
      );

      return {
        status: vercelDeployment.state,
        url: vercelDeployment.url,
        readyState: vercelDeployment.readyState,
        createdAt: new Date(vercelDeployment.createdAt),
        deploymentId: vercelDeployment.id,
      };
    } catch (error: any) {
      console.error("Failed getting deployment metrics", error);
      return null;
    }
  }

  /**
   * Update deployment status (called by webhook)
   */
  async updateStatus(
    vercelDeploymentId: string,
    status: DeploymentStatus,
    options: {
      deploymentUrl?: string;
      errorMessage?: string;
      buildLogs?: string;
    } = {}
  ): Promise<Deployment> {
    return prisma.deployment.update({
      where: { vercel_deployment_id: vercelDeploymentId },
      data: {
        status,
        deployment_url: options.deploymentUrl,
        error_message: options.errorMessage,
        build_logs: options.buildLogs,
        last_deployed_at:
          status === DeploymentStatus.running ? new Date() : undefined,
      },
    });
  }

  /**
   * Get deployment by subdomain
   */
  async getDeploymentBySubdomain(
    subdomain: string
  ): Promise<Deployment | null> {
    return prisma.deployment.findFirst({
      where: {
        subdomain,
        deleted_at: null,
        status: DeploymentStatus.running,
      },
      include: {
        template: true,
        tenant: true,
      },
    });
  }

  // Helper methods

  private mapVercelStatus(
    vercelStatus: "QUEUED" | "BUILDING" | "READY" | "ERROR" | "CANCELED"
  ): DeploymentStatus {
    const statusMap: Record<string, DeploymentStatus> = {
      QUEUED: DeploymentStatus.queued,
      BUILDING: DeploymentStatus.building,
      READY: DeploymentStatus.running,
      ERROR: DeploymentStatus.failed,
      CANCELED: DeploymentStatus.stopped,
    };

    return statusMap[vercelStatus] || DeploymentStatus.pending;
  }

  private getVercelProjectName(subdomain: string): string {
    // Vercel project names must be lowercase and alphanumeric with hyphens
    return subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  }

  private async validateSubdomain(subdomain: string): Promise<void> {
    // Validate subdomain format (alphanumeric + hyphens only)
    const subdomainRegex = /^[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain)) {
      throw new Error(
        "Subdomain must be 1-63 characters long and contain only lowercase letters, numbers, and hyphens"
      );
    }

    // Check if subdomain is already taken
    const existing = await prisma.deployment.findFirst({
      where: {
        subdomain,
        deleted_at: null,
      },
    });

    if (existing) {
      throw new Error("Subdomain is already taken");
    }
  }

  private async validateCustomDomain(domain: string): Promise<void> {
    // Basic domain validation
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domain)) {
      throw new Error("Invalid domain format");
    }

    // Check if custom domain is already taken
    const existing = await prisma.deployment.findFirst({
      where: {
        custom_domain: domain,
        deleted_at: null,
      },
    });

    if (existing) {
      throw new Error("Custom domain is already taken");
    }
  }

  private async logDeploymentActivity(
    tenantId: string,
    action: string,
    resourceId?: string
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          tenant_id: tenantId,
          action,
          resource_type: "deployment",
          resource_id: resourceId,
          created_at: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to log deployment activity:", error);
    }
  }
}

export const deploymentService = new DeploymentService();
