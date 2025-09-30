// lib/services/vercel-deployer.ts

interface VercelDeploymentRequest {
  name: string;
  gitSource: {
    type: "github" | "gitlab" | "bitbucket";
    repo: string;
    ref?: string;
  };
  env?: Record<string, string>;
  buildCommand?: string;
  framework?: string;
  projectSettings?: {
    framework?: string;
    buildCommand?: string;
    outputDirectory?: string;
    installCommand?: string;
    devCommand?: string;
  };
}

interface VercelDeploymentResponse {
  id: string;
  url: string;
  name: string;
  state: "BUILDING" | "READY" | "ERROR" | "QUEUED" | "CANCELED";
  readyState: "BUILDING" | "READY" | "ERROR" | "QUEUED" | "CANCELED";
  createdAt: number;
  creator: {
    uid: string;
  };
}

interface VercelDomainConfig {
  name: string;
  gitBranch?: string;
}

export class VercelDeployer {
  private apiToken: string;
  private teamId?: string;
  private baseUrl = "https://api.vercel.com";

  constructor() {
    this.apiToken = process.env.VERCEL_API_TOKEN!;
    this.teamId = process.env.VERCEL_TEAM_ID;

    if (!this.apiToken) {
      throw new Error("VERCEL_API_TOKEN environment variable is required");
    }
  }

  /**
   * Create a new deployment on Vercel
   */
  async createDeployment(
    request: VercelDeploymentRequest
  ): Promise<VercelDeploymentResponse> {
    const url = this.teamId
      ? `${this.baseUrl}/v13/deployments?teamId=${this.teamId}`
      : `${this.baseUrl}/v13/deployments`;

    const payload = {
      name: request.name,
      gitSource: {
        type: request.gitSource.type,
        repo: request.gitSource.repo,
        ref: request.gitSource.ref || "main",
      },
      env: this.transformEnvVars(request.env),
      projectSettings: request.projectSettings,
      target: "production",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Vercel deployment failed: ${
          error.error?.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(
    deploymentId: string
  ): Promise<VercelDeploymentResponse> {
    const url = this.teamId
      ? `${this.baseUrl}/v13/deployments/${deploymentId}?teamId=${this.teamId}`
      : `${this.baseUrl}/v13/deployments/${deploymentId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to fetch deployment status: ${
          error.error?.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  /**
   * Delete a deployment
   */
  async deleteDeployment(deploymentId: string): Promise<void> {
    const url = this.teamId
      ? `${this.baseUrl}/v13/deployments/${deploymentId}?teamId=${this.teamId}`
      : `${this.baseUrl}/v13/deployments/${deploymentId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const error = await response.json();
      throw new Error(
        `Failed to delete deployment: ${
          error.error?.message || response.statusText
        }`
      );
    }
  }

  /**
   * Assign custom domain to deployment
   */
  async assignDomain(projectName: string, domain: string): Promise<void> {
    const url = this.teamId
      ? `${this.baseUrl}/v9/projects/${projectName}/domains?teamId=${this.teamId}`
      : `${this.baseUrl}/v9/projects/${projectName}/domains`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: domain,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to assign domain: ${
          error.error?.message || response.statusText
        }`
      );
    }
  }

  /**
   * Remove domain from project
   */
  async removeDomain(projectName: string, domain: string): Promise<void> {
    const url = this.teamId
      ? `${this.baseUrl}/v9/projects/${projectName}/domains/${domain}?teamId=${this.teamId}`
      : `${this.baseUrl}/v9/projects/${projectName}/domains/${domain}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const error = await response.json();
      throw new Error(
        `Failed to remove domain: ${
          error.error?.message || response.statusText
        }`
      );
    }
  }

  /**
   * Get deployment logs
   */
  async getDeploymentLogs(deploymentId: string): Promise<string[]> {
    const url = this.teamId
      ? `${this.baseUrl}/v2/deployments/${deploymentId}/events?teamId=${this.teamId}`
      : `${this.baseUrl}/v2/deployments/${deploymentId}/events`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch deployment logs");
    }

    const logs = await response.json();
    return logs.map((log: any) => log.text || log.payload?.text || "");
  }

  /**
   * Transform environment variables to Vercel format
   */
  private transformEnvVars(
    envVars?: Record<string, string>
  ): Array<{ key: string; value: string; type: "plain" | "encrypted" }> {
    if (!envVars) return [];

    return Object.entries(envVars).map(([key, value]) => ({
      key,
      value,
      type: "plain" as const,
    }));
  }

  /**
   * Parse Git URL to extract repo information
   */
  static parseGitUrl(repoUrl: string): {
    type: "github" | "gitlab" | "bitbucket";
    repo: string;
  } {
    // GitHub pattern
    if (repoUrl.includes("github.com")) {
      const match = repoUrl.match(/github\.com[:/]([^/]+\/[^/.]+)/);
      if (match) {
        return {
          type: "github",
          repo: match[1].replace(/\.git$/, ""),
        };
      }
    }

    // GitLab pattern
    if (repoUrl.includes("gitlab.com")) {
      const match = repoUrl.match(/gitlab\.com[:/]([^/]+\/[^/.]+)/);
      if (match) {
        return {
          type: "gitlab",
          repo: match[1].replace(/\.git$/, ""),
        };
      }
    }

    // Bitbucket pattern
    if (repoUrl.includes("bitbucket.org")) {
      const match = repoUrl.match(/bitbucket\.org[:/]([^/]+\/[^/.]+)/);
      if (match) {
        return {
          type: "bitbucket",
          repo: match[1].replace(/\.git$/, ""),
        };
      }
    }

    throw new Error(`Unsupported Git provider: ${repoUrl}`);
  }
}

export const vercelDeployer = new VercelDeployer();
