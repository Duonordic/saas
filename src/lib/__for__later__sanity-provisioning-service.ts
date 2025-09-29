// // ============================================
// // SANITY PROJECT PROVISIONING SERVICE
// // ============================================
// // lib/sanity-provisioning-service.ts

// import { SanityClient, createClient } from '@sanity/client';

// interface SanityProject {
//   id: string;
//   displayName: string;
//   organizationId: string;
//   createdAt: string;
// }

// interface SanityDataset {
//   name: string;
//   aclMode: 'public' | 'private';
// }

// export class SanityProvisioningService {
//   private managementClient: SanityClient;
//   private organizationId: string;

//   constructor() {
//     // Management client with elevated permissions
//     this.managementClient = createClient({
//       projectId: process.env.SANITY_MANAGEMENT_PROJECT_ID!,
//       dataset: 'production',
//       token: process.env.SANITY_MANAGEMENT_TOKEN!, // Super admin token
//       apiVersion: '2024-01-01',
//       useCdn: false,
//     });

//     this.organizationId = process.env.SANITY_ORGANIZATION_ID!;
//   }

//   /**
//    * Create a new Sanity project for a tenant
//    */
//   async createProject(tenantId: string, displayName: string): Promise<SanityProject> {
//     try {
//       // Use Sanity Management API to create project
//       const response = await fetch('https://api.sanity.io/v2021-06-07/projects', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${process.env.SANITY_MANAGEMENT_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           displayName,
//           organizationId: this.organizationId,
//           metadata: {
//             tenantId,
//             createdBy: 'saas-platform'
//           }
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to create Sanity project: ${response.statusText}`);
//       }

//       const project = await response.json() as SanityProject;

//       // Create production dataset
//       await this.createDataset(project.id, 'production');

//       // Initialize with base schema
//       await this.deploySchema(project.id, tenantId);

//       // Create API tokens
//       const tokens = await this.createTokens(project.id);

//       return project;
//     } catch (error) {
//       console.error('Sanity project creation failed:', error);
//       throw error;
//     }
//   }

//   /**
//    * Create a dataset in the Sanity project
//    */
//   async createDataset(projectId: string, datasetName: string): Promise<void> {
//     const response = await fetch(
//       `https://api.sanity.io/v2021-06-07/projects/${projectId}/datasets/${datasetName}`,
//       {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${process.env.SANITY_MANAGEMENT_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           aclMode: 'public'
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to create dataset: ${response.statusText}`);
//     }
//   }

//   /**
//    * Deploy base schema to the new project
//    */
//   async deploySchema(projectId: string, tenantId: string): Promise<void> {
//     // Use Sanity CLI programmatically or HTTP API
//     // This deploys your base schema to the new project
//     const { execSync } = require('child_process');

//     try {
//       execSync(
//         `npx sanity@latest schema deploy \
//          --project ${projectId} \
//          --dataset production \
//          --token ${process.env.SANITY_MANAGEMENT_TOKEN}`,
//         {
//           cwd: './sanity-base-schema',
//           stdio: 'inherit'
//         }
//       );
//     } catch (error) {
//       console.error('Schema deployment failed:', error);
//       throw error;
//     }
//   }

//   /**
//    * Create API tokens for the tenant
//    */
//   async createTokens(projectId: string) {
//     // Create read token for frontend
//     const readToken = await this.createToken(projectId, 'read', ['viewer']);

//     // Create write token for studio
//     const writeToken = await this.createToken(projectId, 'write', ['editor']);

//     return { readToken, writeToken };
//   }

//   private async createToken(
//     projectId: string,
//     label: string,
//     permissions: string[]
//   ): Promise<string> {
//     const response = await fetch(
//       `https://api.sanity.io/v2021-06-07/projects/${projectId}/tokens`,
//       {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${process.env.SANITY_MANAGEMENT_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           label,
//           roleName: permissions[0]
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to create token: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data.token;
//   }

//   /**
//    * Delete a Sanity project
//    */
//   async deleteProject(projectId: string): Promise<void> {
//     const response = await fetch(
//       `https://api.sanity.io/v2021-06-07/projects/${projectId}`,
//       {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${process.env.SANITY_MANAGEMENT_TOKEN}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to delete project: ${response.statusText}`);
//     }
//   }
// }

// // ============================================
// // VERCEL DEPLOYMENT SERVICE
// // ============================================
// // lib/vercel-deployment-service.ts

// export class VercelDeploymentService {
//   private vercelToken: string;
//   private teamId: string;

//   constructor() {
//     this.vercelToken = process.env.VERCEL_TOKEN!;
//     this.teamId = process.env.VERCEL_TEAM_ID!;
//   }

//   /**
//    * Deploy a new Next.js site for tenant on Vercel
//    */
//   async deployTenantSite(tenant: {
//     subdomain: string;
//     sanityProjectId: string;
//     sanityDataset: string;
//     sanityToken: string;
//   }) {
//     try {
//       // 1. Create Vercel project
//       const project = await this.createProject(tenant.subdomain);

//       // 2. Set environment variables
//       await this.setEnvironmentVariables(project.id, {
//         NEXT_PUBLIC_SANITY_PROJECT_ID: tenant.sanityProjectId,
//         NEXT_PUBLIC_SANITY_DATASET: tenant.sanityDataset,
//         SANITY_API_TOKEN: tenant.sanityToken,
//         NEXT_PUBLIC_SITE_URL: `https://${tenant.subdomain}.yourdomain.com`,
//       });

//       // 3. Deploy from template (GitHub repo)
//       const deployment = await this.deployFromGitHub(
//         project.id,
//         'your-org/nextjs-sanity-template',
//         'main'
//       );

//       // 4. Configure custom domain
//       await this.addDomain(project.id, `${tenant.subdomain}.yourdomain.com`);

//       return {
//         projectId: project.id,
//         url: deployment.url,
//         customDomain: `${tenant.subdomain}.yourdomain.com`,
//       };
//     } catch (error) {
//       console.error('Vercel deployment failed:', error);
//       throw error;
//     }
//   }

//   private async createProject(name: string) {
//     const response = await fetch('https://api.vercel.com/v9/projects', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${this.vercelToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         name,
//         framework: 'nextjs',
//         teamId: this.teamId,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to create Vercel project: ${response.statusText}`);
//     }

//     return await response.json();
//   }

//   private async setEnvironmentVariables(
//     projectId: string,
//     envVars: Record<string, string>
//   ) {
//     for (const [key, value] of Object.entries(envVars)) {
//       await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${this.vercelToken}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           key,
//           value,
//           type: key.startsWith('NEXT_PUBLIC_') ? 'plain' : 'encrypted',
//           target: ['production', 'preview', 'development'],
//         }),
//       });
//     }
//   }

//   private async deployFromGitHub(
//     projectId: string,
//     repo: string,
//     branch: string
//   ) {
//     const response = await fetch('https://api.vercel.com/v13/deployments', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${this.vercelToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         name: projectId,
//         gitSource: {
//           type: 'github',
//           repo,
//           ref: branch,
//         },
//         projectSettings: {
//           framework: 'nextjs',
//         },
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to deploy: ${response.statusText}`);
//     }

//     return await response.json();
//   }

//   private async addDomain(projectId: string, domain: string) {
//     const response = await fetch(
//       `https://api.vercel.com/v9/projects/${projectId}/domains`,
//       {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${this.vercelToken}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name: domain }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to add domain: ${response.statusText}`);
//     }

//     return await response.json();
//   }

//   async deleteProject(projectId: string): Promise<void> {
//     await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${this.vercelToken}`,
//       },
//     });
//   }
// }

// // ============================================
// // MAIN TENANT PROVISIONING ORCHESTRATOR
// // ============================================
// // lib/tenant-provisioning.ts

// import { db } from './db';

// export interface TenantProvisioningRequest {
//   subdomain: string;
//   companyName: string;
//   adminEmail: string;
//   plan: 'starter' | 'pro' | 'enterprise';
//   customDomain?: string;
// }

// export async function provisionTenant(request: TenantProvisioningRequest) {
//   const sanityService = new SanityProvisioningService();
//   const vercelService = new VercelDeploymentService();

//   try {
//     // 1. Create database record
//     const tenant = await db.tenant.create({
//       data: {
//         subdomain: request.subdomain,
//         companyName: request.companyName,
//         adminEmail: request.adminEmail,
//         plan: request.plan,
//         status: 'provisioning',
//       },
//     });

//     // 2. Create Sanity project
//     console.log(`Creating Sanity project for ${request.subdomain}...`);
//     const sanityProject = await sanityService.createProject(
//       tenant.id,
//       `${request.companyName} CMS`
//     );

//     const tokens = await sanityService.createTokens(sanityProject.id);

//     // 3. Deploy Next.js site on Vercel
//     console.log(`Deploying frontend for ${request.subdomain}...`);
//     const deployment = await vercelService.deployTenantSite({
//       subdomain: request.subdomain,
//       sanityProjectId: sanityProject.id,
//       sanityDataset: 'production',
//       sanityToken: tokens.readToken,
//     });

//     // 4. Update tenant record with deployment info
//     await db.tenant.update({
//       where: { id: tenant.id },
//       data: {
//         status: 'active',
//         sanityProjectId: sanityProject.id,
//         sanityReadToken: tokens.readToken,
//         sanityWriteToken: tokens.writeToken,
//         vercelProjectId: deployment.projectId,
//         frontendUrl: `https://${request.subdomain}.yourdomain.com`,
//         studioUrl: `https://${request.subdomain}.yourdomain.com/studio`,
//       },
//     });

//     // 5. Send welcome email with credentials
//     // await sendWelcomeEmail(tenant);

//     return {
//       success: true,
//       tenant,
//       urls: {
//         frontend: deployment.customDomain,
//         studio: `${deployment.customDomain}/studio`,
//         sanityManage: `https://www.sanity.io/manage/project/${sanityProject.id}`,
//       },
//     };
//   } catch (error) {
//     // Rollback on failure
//     console.error('Provisioning failed:', error);

//     await db.tenant.update({
//       where: { id: tenant.id },
//       data: { status: 'failed' },
//     });

//     throw error;
//   }
// }

// // ============================================
// // API ROUTE
// // ============================================
// // app/api/tenants/provision/route.ts

// import { NextResponse } from 'next/server';
// import { provisionTenant } from '@/lib/tenant-provisioning';

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();

//     // Validate subdomain availability
//     // Check DNS, validate input, etc.

//     const result = await provisionTenant(data);

//     return NextResponse.json(result);
//   } catch (error) {
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'Provisioning failed' },
//       { status: 500 }
//     );
//   }
// }
