app/
├── (marketing)/ # Your SaaS marketing site
│ ├── layout.tsx
│ ├── page.tsx # Landing page
│ ├── pricing/
│ ├── templates/ # Template showcase
│ │ ├── page.tsx # Browse templates
│ │ └── [templateId]/
│ │ └── page.tsx # Template preview
│ └── auth/
│ ├── login/
│ └── signup/
│
├── dashboard/ # Customer dashboard (app.yourplatform.com)
│ ├── layout.tsx # Dashboard shell
│ ├── page.tsx # Dashboard home
│ ├── sites/
│ │ ├── page.tsx # List user's sites
│ │ ├── [siteId]/
│ │ │ ├── page.tsx # Site overview & analytics
│ │ │ ├── content/ # Sanity Studio integration
│ │ │ │ └── page.tsx # Embedded or iframe Sanity
│ │ │ ├── design/
│ │ │ │ ├── page.tsx # Template customization
│ │ │ │ └── theme/
│ │ │ │ └── page.tsx # Theme editor where the user can manage all their themes (setting tailwindcss custom properties?)
│ │ │ ├── settings/
│ │ │ │ ├── page.tsx # Site settings
│ │ │ │ ├── domain/
│ │ │ │ │ └── page.tsx # Custom domain setup
│ │ │ │ └── seo/
│ │ │ │ └── page.tsx # SEO settings
│ │ │ └── deploy/
│ │ │ └── page.tsx # Deployment status
│ │ └── create/
│ │ ├── page.tsx # Site creation wizard
│ │ ├── template/
│ │ │ └── page.tsx # Template selection
│ │ └── setup/
│ │ └── page.tsx # Initial setup
│ ├── account/
│ │ ├── page.tsx # Profile settings
│ │ ├── billing/
│ │ │ └── page.tsx # Subscription management
│ │ └── api-keys/
│ │ └── page.tsx # API access
│ └── templates/ # Template management (if they can create custom)
│ ├── page.tsx
│ └── [templateId]/
│ └── page.tsx
│
├── sites/ # Dynamic tenant sites
│ └── [domain]/ # Catch-all for tenant domains
│ ├── layout.tsx # Dynamic layout based on template
│ ├── page.tsx # Dynamic homepage
│ └── [...slug]/ # All pages (fetched from Sanity)
│ └── page.tsx
│
├── api/
│ ├── auth/ # Authentication
│ ├── sites/
│ │ ├── route.ts # CRUD operations for sites
│ │ ├── [siteId]/
│ │ │ ├── route.ts # Individual site operations
│ │ │ ├── deploy/
│ │ │ │ └── route.ts # Trigger deployments
│ │ │ ├── content/
│ │ │ │ └── route.ts # Proxy to tenant's Sanity
│ │ │ └── analytics/
│ │ │ └── route.ts # Site analytics
│ │ └── templates/
│ │ ├── route.ts # Available templates
│ │ └── [templateId]/
│ │ └── route.ts # Template details
│ ├── tenants/
│ │ ├── [domain]/
│ │ │ └── route.ts # Tenant site API
│ │ └── resolve/
│ │ └── route.ts # Domain to tenant resolution
│ ├── sanity/
│ │ ├── provision/
│ │ │ └── route.ts # Create new Sanity projects
│ │ ├── webhook/
│ │ │ └── route.ts # Handle Sanity webhooks
│ │ └── proxy/
│ │ └── [projectId]/
│ │ └── route.ts # Proxy to specific Sanity project
│ ├── templates/
│ │ ├── route.ts # Template CRUD
│ │ └── render/
│ │ └── [templateId]/
│ │ └── route.ts # Server-side template rendering
│ └── webhooks/
│ ├── stripe/ # Payment webhooks
│ └── deployment/ # Deployment status
│
├── components/
|
Shared ui components are imported from internal @dn/ui package.
│ ├── dashboard/  
│ ├── elements/ # Template components
│ │ ├── blog/ # Blog template components
│ │ ├── portfolio/ # Portfolio template components
│ │ ├── ecommerce/ # E-commerce template components
│ │ └── landing/ # Landing page template components
│ ├── sections/ # Dashboard-specific components
│ └── tenant/ # Tenant site components (header,footer,main) - components com from internal @dn/templates/{plan} package. It will also be necessary to configure an intelligent styles solution that allows client components to have completely
individualized styles. Tailwindcss 4 is used.
│
├── lib/
│ ├── auth.ts # Authentication logic
│ ├── database.ts # Database connection
│ ├── sanity/
│ │ ├── client.ts # Multi-tenant Sanity client
│ │ ├── provision.ts # Sanity project provisioning
│ │ └── schemas/ # Shared schemas
│ ├── templates/
│ │ ├── registry.ts # Template registry
│ │ ├── renderer.ts # Dynamic template rendering
│ │ └── types.ts # Template type definitions
│ ├── deployment/
│ │ ├── vercel.ts # Vercel deployment API
│ │ └── status.ts # Deployment status tracking
│ └── utils/
│ ├── domain.ts # Domain utilities
│ └── tenant.ts # Tenant resolution
│
├── templates/ # Template definitions
│ ├── blog/
│ │ ├── config.json # Template metadata
│ │ ├── components/ # Template-specific components
│ │ ├── pages/ # Page templates
│ │ └── styles/ # Template styles
│ ├── portfolio/
│ ├── ecommerce/
│ └── landing/
│
├── middleware.ts # Enhanced tenant routing
└── global.css
