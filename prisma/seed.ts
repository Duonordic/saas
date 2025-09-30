// prisma/seed.ts

import {
  PlanType,
  TenantStatus,
  UserRole,
  TemplateCategory,
  Prisma,
} from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

// Use a secure default password for development
const DEFAULT_PASSWORD = "password123";

async function main() {
  console.log("Starting database seeding...");

  // Hash password for all users
  const password_hash = await hash(DEFAULT_PASSWORD, 12);

  const systemTenant = await prisma.tenant.upsert({
    where: { slug: "system-meta" },
    update: {},
    create: {
      slug: "system-meta",
      name: "Platform System Tenant",
      sanityProjectId: "meta-project-id",
      status: TenantStatus.active,
      plan: PlanType.enterprise,
    },
  });
  console.log(`Created/Updated System Tenant: ${systemTenant.id}`);

  // --- 1. Create a Global Super Admin User ---
  const superAdmin = await prisma.user.upsert({
    where: {
      tenant_id_email: {
        tenant_id: systemTenant.id,
        email: "admin@duonordic.com",
      },
    },
    update: {
      password_hash,
      tenant_id: systemTenant.id,
    },
    create: {
      email: "admin@duonordic.com",
      name: "System Admin",
      role: UserRole.owner,
      password_hash,
      email_verified: true,
      tenant_id: systemTenant.id,
    },
  });
  console.log(`Created/Updated Super Admin: ${superAdmin.email}`);

  // --- 2. Create Tenants and Associated Owners ---
  const tenantsToCreate = [
    {
      slug: "acme",
      name: "Acme Corporation",
      domain: "acme.localhost",
      sanityProjectId: "prj_acme_prod",
      plan: PlanType.pro,
      status: TenantStatus.active,
      ownerEmail: "owner@acme.com",
      config: {
        theme: {
          primaryColor: "#3B82F6",
          secondaryColor: "#10B981",
          fontFamily: "Inter",
          borderRadius: "8px",
          darkMode: false,
        },
        features: {
          maxUsers: 10,
          customDomain: true,
          apiAccess: true,
          advancedAnalytics: true,
        },
        branding: {
          logoUrl: null,
          faviconUrl: null,
          customCSS: null,
        },
      },
    },
    {
      slug: "techco",
      name: "Tech Company",
      domain: "techco.localhost",
      sanityProjectId: "prj_techco_prod",
      plan: PlanType.starter,
      status: TenantStatus.trial,
      trial_ends_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      ownerEmail: "owner@techco.com",
    },
    {
      slug: "startup",
      name: "Innovative Startup",
      domain: "startup.localhost",
      sanityProjectId: "prj_startup_prod",
      plan: PlanType.free,
      status: TenantStatus.active,
      ownerEmail: "ceo@startup.com",
    },
  ];

  for (const tenantData of tenantsToCreate) {
    const { ownerEmail, ...tenantDetails } = tenantData;
    const { trial_ends_at, ...tenantCreateData } = tenantDetails;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the Tenant record
      const tenant = await tx.tenant.upsert({
        where: { slug: tenantDetails.slug },
        update: { ...tenantDetails, trial_ends_at: trial_ends_at },
        create: { ...tenantCreateData, trial_ends_at: trial_ends_at },
      });

      console.log(`-> Created/Updated Tenant: ${tenant.name}`);

      // Create the Tenant Owner User
      const owner = await tx.user.upsert({
        where: {
          tenant_id_email: {
            tenant_id: tenant.id,
            email: ownerEmail,
          },
        },
        update: {
          tenant_id: tenant.id,
          password_hash,
        },
        create: {
          email: ownerEmail,
          name: "Tenant Owner",
          role: UserRole.owner,
          password_hash,
          tenant_id: tenant.id,
          email_verified: true,
        },
      });

      console.log(`   -> Created/Updated Tenant Owner: ${owner.email}`);

      // Create additional users for the tenant
      const additionalUsers = [
        {
          email: "dev@acme.com",
          name: "John Developer",
          role: UserRole.admin,
        },
        {
          email: "content@acme.com",
          name: "Sarah Content",
          role: UserRole.member,
        },
      ];

      for (const userData of additionalUsers) {
        const userEmail = userData.email.replace("acme", tenant.slug);
        await tx.user.upsert({
          where: {
            tenant_id_email: {
              tenant_id: tenant.id,
              email: userEmail,
            },
          },
          update: {
            tenant_id: tenant.id,
            password_hash,
          },
          create: {
            ...userData,
            email: userEmail,
            password_hash,
            tenant_id: tenant.id,
            email_verified: true,
          },
        });
        console.log(`   -> Created user: ${userEmail}`);
      }
    });
  }

  // --- 3. Create Sample Templates ---
  const templatesToCreate = [
    {
      slug: "nextjs-saas-starter",
      name: "Next.js SaaS Starter",
      description:
        "A complete SaaS starter kit with authentication, billing, and dashboard",
      category: TemplateCategory.saas,
      thumbnail_url:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400",
      repo_url: "https://github.com/vercel/next-saas-starter",
      repo_branch: "main",
      demo_url: "https://next-saas-starter.vercel.app",
      config_schema: {
        type: "object",
        properties: {
          appName: { type: "string", default: "My SaaS App" },
          primaryColor: { type: "string", default: "#3B82F6" },
          enableAuth: { type: "boolean", default: true },
          databaseType: {
            type: "string",
            enum: ["postgresql", "mysql", "sqlite"],
            default: "postgresql",
          },
        },
      },
      default_env: {
        DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
        NEXTAUTH_SECRET: "your-secret-here",
        NEXTAUTH_URL: "https://your-domain.com",
        STRIPE_PUBLISHABLE_KEY: "pk_test_...",
        STRIPE_SECRET_KEY: "sk_test_...",
      },
      version: "1.2.0",
      author: "Vercel",
      tags: ["saas", "nextjs", "authentication", "stripe"],
      is_published: true,
    },
    {
      slug: "nextjs-ecommerce",
      name: "Next.js E-commerce Store",
      description:
        "Modern e-commerce store with shopping cart, payments, and inventory management",
      category: TemplateCategory.ecommerce,
      thumbnail_url:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400",
      repo_url: "https://github.com/vercel/next-ecommerce",
      repo_branch: "main",
      demo_url: "https://next-ecommerce.vercel.app",
      config_schema: {
        type: "object",
        properties: {
          storeName: { type: "string", default: "My Store" },
          currency: { type: "string", default: "USD" },
          paymentGateway: {
            type: "string",
            enum: ["stripe", "paypal"],
            default: "stripe",
          },
          inventoryManagement: { type: "boolean", default: true },
        },
      },
      default_env: {
        STRIPE_PUBLISHABLE_KEY: "pk_test_...",
        STRIPE_SECRET_KEY: "sk_test_...",
        DATABASE_URL: "postgresql://user:pass@localhost:5432/ecommerce",
        SENDGRID_API_KEY: "sg_key_...",
      },
      version: "1.1.0",
      author: "Vercel",
      tags: ["ecommerce", "nextjs", "stripe", "payments"],
      is_published: true,
    },
    {
      slug: "nextjs-portfolio",
      name: "Next.js Portfolio",
      description:
        "Beautiful portfolio website for designers, developers, and creatives",
      category: TemplateCategory.portfolio,
      thumbnail_url:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      repo_url: "https://github.com/vercel/next-portfolio",
      repo_branch: "main",
      demo_url: "https://next-portfolio.vercel.app",
      config_schema: {
        type: "object",
        properties: {
          name: { type: "string", default: "Your Name" },
          profession: { type: "string", default: "Developer" },
          theme: {
            type: "string",
            enum: ["light", "dark", "auto"],
            default: "light",
          },
          socialLinks: { type: "boolean", default: true },
        },
      },
      default_env: {
        SITE_URL: "https://your-portfolio.com",
        CONTACT_EMAIL: "hello@example.com",
        GITHUB_URL: "https://github.com/yourusername",
        LINKEDIN_URL: "https://linkedin.com/in/yourusername",
      },
      version: "1.0.0",
      author: "Vercel",
      tags: ["portfolio", "nextjs", "personal"],
      is_published: true,
    },
  ];

  for (const templateData of templatesToCreate) {
    const template = await prisma.template.upsert({
      where: { slug: templateData.slug },
      update: templateData as any,
      create: templateData as any,
    });
    console.log(`-> Created/Updated Template: ${template.name}`);
  }

  // --- 4. Create Sample Deployments ---
  const acmeTenant = await prisma.tenant.findUnique({
    where: { slug: "acme" },
  });
  const saasTemplate = await prisma.template.findUnique({
    where: { slug: "nextjs-saas-starter" },
  });

  if (acmeTenant && saasTemplate) {
    const deployment = await prisma.deployment.upsert({
      where: { subdomain: "acme-saas" },
      update: {},
      create: {
        tenant_id: acmeTenant.id,
        template_id: saasTemplate.id,
        name: "Acme SaaS Platform",
        subdomain: "acme-saas",
        status: "running",
        deployment_url: "https://acme-saas.localhost",
        vercel_deployment_id: "dpl_acmesaas_xyz123",
        env_vars: {
          APP_NAME: "Acme SaaS",
          PRIMARY_COLOR: "#FF6B35",
          DATABASE_URL: "postgresql://acme:password@localhost:5432/acme_saas",
        },
        last_deployed_at: new Date(),
      },
    });
    console.log(`-> Created sample deployment: ${deployment.name}`);
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
