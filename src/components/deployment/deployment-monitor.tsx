// lib/workers/deployment-monitor.ts
import { deploymentService } from "@/lib/services/deployment-service";
import { prisma } from "@/lib/prisma";

export class DeploymentMonitor {
  async checkDeploymentHealth() {
    const deployments = await prisma.deployment.findMany({
      where: {
        status: "running",
        deleted_at: null,
      },
    });

    for (const deployment of deployments) {
      try {
        const health = await deploymentService.getHealth(deployment.id);

        if (health.status === "unhealthy") {
          // Trigger auto-restart or send alert
          console.log(
            `Deployment ${deployment.name} is unhealthy: ${health.message}`
          );
        }
      } catch (error) {
        console.error(`Health check failed for ${deployment.name}:`, error);
      }
    }
  }

  async cleanupStaleDeployments() {
    // Clean up deployments that have been in provisioning state for too long
    const staleTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

    const staleDeployments = await prisma.deployment.findMany({
      where: {
        status: { in: ["provisioning", "building"] },
        created_at: { lt: staleTime },
      },
    });

    for (const deployment of staleDeployments) {
      await deploymentService.deleteDeployment(deployment.id);
    }
  }
}
