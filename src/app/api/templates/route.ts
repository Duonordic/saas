import { NextResponse } from "next/server";
import { LocalDeploymentService } from "@/lib/deployment-service";

export async function GET() {
  try {
    const deploymentService = new LocalDeploymentService();
    const templates = await deploymentService.getAvailableTemplates();

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list templates" },
      { status: 500 }
    );
  }
}
