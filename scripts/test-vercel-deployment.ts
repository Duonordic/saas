// scripts/test-vercel-deployment.ts
import { deploymentService } from "@/lib/services/deployment-service";

async function testDeployment() {
  try {
    console.log("Creating test deployment...");

    const deployment = await deploymentService.deploy({
      tenantId: "test-tenant-id",
      templateId: "your-template-id",
      name: "Test Deployment",
      subdomain: "test-" + Date.now(),
      envVars: {
        NODE_ENV: "production",
      },
    });

    console.log("Deployment created:", deployment.id);
    console.log("Vercel ID:", deployment.vercel_deployment_id);
    console.log("Status:", deployment.status);

    // Wait for webhook updates
    console.log("Waiting for webhook updates...");
    console.log("Check your database for status changes");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testDeployment();
