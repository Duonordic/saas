The core idea is to **build and test the multi-tenant application logic in a simple, shared development environment**, and only use the complex containerized system for final integration testing.

Here's a revised, production-focused roadmap:

## 🎯 Revised Architecture: Hybrid Development Approach

### Development Mode (Shared App)

```
┌─────────────────────────────────┐
│   Single Next.js Dev Server     │
│  (Localhost:3000)              │
│                                 │
│  ┌─────────┐ ┌─────────┐        │
│  │ TenantA │ │ TenantB │        │
│  │ Config  │ │ Config  │ ...    │
│  └─────────┘ └─────────┘        │
│                                 │
│  Shared database, single build  │
│  Hot reload, fast iteration     │
└─────────────────────────────────┘
```

### Production/Staging Mode (Containerized)

```
┌─────────────┐ ┌─────────────┐
│ Tenant A    │ │ Tenant B    │
│ Container   │ │ Container   │
│ Port: 3001  │ │ Port: 3002  │
└─────────────┘ └─────────────┘
```

---

## 🗺️ Revised Implementation Roadmap

## Phase 1: Production-Ready Shared Application

### Milestone 1.1: Robust Multi-Tenant Foundation

**Goal**: Build a solid, database-backed multi-tenant application

**Tasks**:

1. **Replace Mock Services with Real Database**

```typescript
// lib/db.ts - Proper database setup
import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// lib/tenant-service.ts
export class TenantService {
  async getTenant(tenantId: string): Promise<Tenant> {
    const result = await db.query(
      `SELECT * FROM tenants WHERE id = $1 AND status = 'active'`,
      [tenantId]
    );
    return result.rows[0];
  }

  async getTenantByHostname(hostname: string): Promise<Tenant> {
    // For production domain-based routing
    const result = await db.query(
      `SELECT * FROM tenants WHERE domain = $1 AND status = 'active'`,
      [hostname]
    );
    return result.rows[0];
  }
}
```

2. **Enhanced Middleware for Tenant Resolution**

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import { TenantService } from "@/lib/tenant-service";

const tenantService = new TenantService();

export async function middleware(request: NextRequest) {
  // Multiple resolution strategies
  const tenant = await resolveTenant(request);

  if (!tenant) {
    return NextResponse.redirect(new URL("/tenant-not-found", request.url));
  }

  // Add tenant to request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", tenant.id);
  requestHeaders.set("x-tenant-config", JSON.stringify(tenant.config));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

async function resolveTenant(request: NextRequest) {
  // 1. Subdomain resolution (production)
  const hostname = request.headers.get("host")?.split(".")[0];
  if (hostname && hostname !== "www" && hostname !== "app") {
    return tenantService.getTenantByHostname(hostname);
  }

  // 2. Query parameter (development)
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenant");
  if (tenantId) {
    return tenantService.getTenant(tenantId);
  }

  // 3. Header-based (API requests)
  const headerTenant = request.headers.get("x-tenant-id");
  if (headerTenant) {
    return tenantService.getTenant(headerTenant);
  }

  return null;
}
```

3. **Tenant-Aware Data Access Layer**

```typescript
// lib/with-tenant.ts - Automatic tenant isolation
export function withTenant<T>(
  tenantId: string,
  queryFn: (tenantId: string) => Promise<T>
) {
  // Automatically adds tenant filtering to all queries
  return queryFn(tenantId);
}

// Usage in components
async function getTenantPosts(tenantId: string) {
  return withTenant(tenantId, async (id) => {
    return db.query(
      `SELECT * FROM posts WHERE tenant_id = $1 AND published = true`,
      [id]
    );
  });
}
```

### Milestone 1.2: Tenant Configuration & Customization

**Goal**: Implement dynamic tenant configuration without rebuilds

**Tasks**:

1. **Database-Driven Configuration**

```typescript
// lib/tenant-config.ts
export class TenantConfig {
  private cache = new Map<string, any>();

  async getConfig(tenantId: string): Promise<TenantConfig> {
    if (this.cache.has(tenantId)) {
      return this.cache.get(tenantId);
    }

    const result = await db.query(`SELECT config FROM tenants WHERE id = $1`, [
      tenantId,
    ]);

    const config = result.rows[0]?.config || {};
    this.cache.set(tenantId, config);

    return config;
  }

  async updateConfig(tenantId: string, updates: Partial<TenantConfig>) {
    await db.query(
      `UPDATE tenants SET config = config || $1, updated_at = NOW() WHERE id = $2`,
      [JSON.stringify(updates), tenantId]
    );
    this.cache.delete(tenantId); // Bust cache
  }
}
```

2. **Runtime Theme System**

```typescript
// app/layout.tsx
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getTenantFromRequest(); // From headers/middleware

  return (
    <html lang="en">
      <head>
        <TenantStyles tenant={tenant} />
      </head>
      <body className={getTenantClassName(tenant)}>
        <TenantProvider value={tenant}>{children}</TenantProvider>
      </body>
    </html>
  );
}

// components/tenant-styles.tsx
export function TenantStyles({ tenant }: { tenant: Tenant }) {
  return (
    <style jsx global>{`
      :root {
        --primary-color: ${tenant.config.primaryColor || "#3B82F6"};
        --font-family: ${tenant.config.fontFamily || "Inter, sans-serif"};
        --border-radius: ${tenant.config.borderRadius || "8px"};
      }

      .tenant-${tenant.id} {
        /* Tenant-specific styles */
      }
    `}</style>
  );
}
```

### Milestone 1.3: Admin Management Interface

**Goal**: Build tenant management within the shared app

**Tasks**:

1. **Tenant CRUD Operations**

```typescript
// app/admin/tenants/page.tsx
export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);

  async function createTenant(data: CreateTenantData) {
    const response = await fetch("/api/admin/tenants", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const newTenant = await response.json();
      setTenants((prev) => [...prev, newTenant]);
    }
  }

  return (
    <div>
      <TenantCreationForm onSubmit={createTenant} />
      <TenantList tenants={tenants} />
    </div>
  );
}
```

2. **Real-time Tenant Monitoring**

```typescript
// components/tenant-health.tsx
export function TenantHealth({ tenantId }: { tenantId: string }) {
  const [health, setHealth] = useState<HealthStatus>("unknown");

  useEffect(() => {
    const checkHealth = async () => {
      const response = await fetch(`/api/admin/tenants/${tenantId}/health`);
      const status = await response.json();
      setHealth(status);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [tenantId]);

  return <HealthIndicator status={health} />;
}
```

---

## Phase 2: Production Deployment Foundation

### Milestone 2.1: Database Design & Migrations

**Goal**: Production-ready data architecture

**Tasks**:

1. **Tenant Database Schema**

```sql
-- migrations/001_create_tenants.sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tenant_settings (
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  key VARCHAR(255) NOT NULL,
  value JSONB,
  PRIMARY KEY (tenant_id, key)
);

-- Row Level Security for super-admin access
CREATE POLICY "Admins can access all tenant data" ON tenants
  FOR ALL USING (current_user = 'admin');
```

2. **Data Isolation Patterns**

```typescript
// lib/row-level-security.ts
export function enableRLS() {
  // Automatically set tenant context for each request
  db.query(`SET app.tenant_id = $1`, [tenantId])
}

// In your database, create RLS policies
CREATE POLICY "Users can only access their tenant's data" ON posts
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

### Milestone 2.2: Production Deployment Pipeline

**Goal**: One-command deployment for the shared application

**Tasks**:

1. **Dockerfile for Shared App**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

2. **Docker Compose for Full Stack**

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/app
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=app
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Phase 3: Containerized Testing Environment

### Milestone 3.1: Lightweight Container Testing

**Goal**: Test containerization without full provisioning complexity

**Tasks**:

1. **Simple Container Testing Script**

```typescript
// scripts/test-container.ts
export async function testTenantContainer(tenant: Tenant) {
  // Only build and test one container at a time
  const imageName = `tenant-test-${tenant.id}`;

  // Use existing app, just test isolation
  await docker.buildImage({
    context: ".",
    dockerfile: "Dockerfile.tenant",
    buildArgs: {
      TENANT_ID: tenant.id,
      NEXT_PUBLIC_APP_URL: `https://${tenant.domain}`,
    },
  });

  // Test basic functionality
  const container = await docker.runContainer({
    image: imageName,
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
      TENANT_ID: tenant.id,
    },
  });

  // Run health checks
  const healthy = await checkContainerHealth(container.id);

  // Cleanup
  await container.stop();
  await container.remove();

  return healthy;
}
```

2. **Template Testing (Not Full Provisioning)**

```typescript
// Only test that templates work, don't use for development
export async function validateTemplate(templateId: string) {
  const template = await getTemplate(templateId);

  // Test build
  const buildSuccess = await docker.buildImage({
    context: `./templates/${templateId}`,
    dockerfile: "Dockerfile",
  });

  // Test runtime
  const runtimeSuccess = await testTemplateRuntime(templateId);

  return buildSuccess && runtimeSuccess;
}
```

### Milestone 3.2: Staging Environment

**Goal**: Production-like environment for final testing

**Tasks**:

1. **Staging Docker Compose**

```yaml
# docker-compose.staging.yml
version: "3.8"
services:
  app:
    build: .
    environment:
      - NODE_ENV=staging
      - DATABASE_URL=postgresql://user:pass@db:5432/app_staging
    ports:
      - "3000:3000"

  # Add nginx for subdomain routing in staging
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.staging.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
```

2. **Subdomain Routing Test**

```nginx
# nginx.staging.conf
server {
  listen 80;

  # Tenant subdomain routing
  server_name ~^(?<tenant>.+)\.staging\.example\.com$;

  location / {
    proxy_pass http://app:3000;
    proxy_set_header X-Tenant-Domain $tenant;
  }
}
```

---

## 🚀 Recommended Development Workflow

### Daily Development (Shared App)

```bash
# 1. Start database and app
docker-compose up db
npm run dev

# 2. Work on features using ?tenant=xxx parameter
# 3. Test multiple tenants simultaneously
# 4. Hot reload works perfectly
```

### Testing (Container Environment)

```bash
# 1. Run container tests weekly
npm run test:containers

# 2. Deploy to staging for integration tests
npm run deploy:staging

# 3. Validate tenant isolation
npm run test:isolation
```

### Production Deployment

```bash
# 1. Deploy shared application
npm run deploy:prod

# 2. Run health checks
npm run healthcheck

# 3. Monitor tenant performance
```

---

## ✅ Benefits of This Approach

1. **🚀 Speed**: Development is 10x faster with hot reload
2. **🛠️ Simplicity**: No complex provisioning during development
3. **💾 Resource Efficient**: Single instance vs 10+ containers
4. **🔬 Better Testing**: Isolate container concerns from business logic
5. **🎯 Production Focus**: Build what actually matters for production

## 📋 Phase Completion Criteria

### Phase 1 Complete When:

- [ ] Database-backed tenant system works
- [ ] Multiple tenants work simultaneously in dev
- [ ] Admin can create/configure tenants via UI
- [ ] Theme system works without rebuilds

### Phase 2 Complete When:

- [ ] Application deploys to production successfully
- [ ] Database migrations work
- [ ] Basic monitoring is in place
- [ ] SSL/domain routing works

### Phase 3 Complete When:

- [ ] Container tests pass consistently
- [ ] Staging environment mirrors production
- [ ] Tenant isolation verified
- [ ] Performance benchmarks met

This approach gets you to a production-ready multi-tenant application much faster, while still validating the containerization strategy for when you truly need it (scale, security requirements, etc.).

schema.prisma:

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
provider = "prisma-client-js"
output = "../src/generated/prisma"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

model Tenant {
id String @id @default(cuid()) @db.Uuid
slug String @unique @db.VarChar(63)
name String @db.VarChar(255)
domain String? @unique @db.VarChar(255)
status TenantStatus @default(active)
plan PlanType @default(free)

// JSON configuration
config Json? @default("{\"theme\":{\"primaryColor\":\"#3B82F6\",\"secondaryColor\":\"#10B981\",\"fontFamily\":\"Inter\",\"borderRadius\":\"8px\",\"darkMode\":false},\"features\":{\"maxUsers\":5,\"customDomain\":false,\"apiAccess\":false,\"advancedAnalytics\":false},\"branding\":{\"logoUrl\":null,\"faviconUrl\":null,\"customCSS\":null}}")

// Timestamps
trial_ends_at DateTime? @db.Timestamptz
subscription_ends_at DateTime? @db.Timestamptz
created_at DateTime @default(now()) @db.Timestamptz
updated_at DateTime @updatedAt @db.Timestamptz
deleted_at DateTime? @db.Timestamptz

// Relations
settings TenantSetting[]
users User[]
auditLogs AuditLog[]
apiKeys ApiKey[]
posts Post[]

@@map("tenants")
}

model TenantSetting {
id String @id @default(cuid()) @db.Uuid
tenant_id String @db.Uuid
key String @db.VarChar(255)
value Json?
created_at DateTime @default(now()) @db.Timestamptz
updated_at DateTime @updatedAt @db.Timestamptz

// Relations
tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

@@unique([tenant_id, key])
@@map("tenant_settings")
}

model User {
id String @id @default(cuid()) @db.Uuid
tenant_id String @db.Uuid
email String @db.VarChar(255)
name String? @db.VarChar(255)
role UserRole @default(member)

// Auth fields
password_hash String? @db.VarChar(255)
email_verified Boolean @default(false)
last_login_at DateTime? @db.Timestamptz

// Timestamps
created_at DateTime @default(now()) @db.Timestamptz
updated_at DateTime @updatedAt @db.Timestamptz
deleted_at DateTime? @db.Timestamptz

// Relations
tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)
auditLogs AuditLog[]
posts Post[]

@@unique([tenant_id, email])
@@map("users")
}

model AuditLog {
id String @id @default(cuid()) @db.Uuid
tenant_id String @db.Uuid
user_id String? @db.Uuid
action String @db.VarChar(100)
resource_type String? @db.VarChar(100)
resource_id String? @db.Uuid
changes Json?
ip_address String? @db.Inet
user_agent String? @db.Text
created_at DateTime @default(now()) @db.Timestamptz

// Relations
tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)
user User? @relation(fields: [user_id], references: [id])

@@map("audit_logs")
}

model ApiKey {
id String @id @default(cuid()) @db.Uuid
tenant_id String @db.Uuid
name String @db.VarChar(255)
key_hash String @unique @db.VarChar(255)
last_used_at DateTime? @db.Timestamptz
expires_at DateTime? @db.Timestamptz
scopes Json? @default("[\"read\"]")
created_at DateTime @default(now()) @db.Timestamptz
revoked_at DateTime? @db.Timestamptz

// Relations
tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

@@map("api_keys")
}

model Post {
id String @id @default(cuid()) @db.Uuid
tenant_id String @db.Uuid
author_id String @db.Uuid
title String @db.VarChar(255)
slug String @db.VarChar(255)
content String? @db.Text
published Boolean @default(false)
published_at DateTime? @db.Timestamptz
metadata Json? @default("{}")
created_at DateTime @default(now()) @db.Timestamptz
updated_at DateTime @updatedAt @db.Timestamptz
deleted_at DateTime? @db.Timestamptz

// Relations
tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)
author User @relation(fields: [author_id], references: [id], onDelete: Cascade)

@@unique([tenant_id, slug])
@@map("posts")
}

enum TenantStatus {
active
suspended
trial
cancelled
}

enum PlanType {
free
starter
pro
enterprise
}

enum UserRole {
owner
admin
member
viewer
}
