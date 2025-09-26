#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import yaml from "js-yaml";

// Template configuration
const PLANS = ["basic", "business", "enterprise"] as const;
type Plan = (typeof PLANS)[number];

interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  plan: Plan;
  author: string;
}

interface LockfilePackage {
  version: string;
  resolution?: string;
}

interface LockfileContent {
  lockfileVersion: number;
  importers?: {
    [path: string]: {
      dependencies?: Record<string, LockfilePackage>;
      devDependencies?: Record<string, LockfilePackage>;
    };
  };
  packages?: Record<string, LockfilePackage>;
}

class TemplateCreator {
  private config: TemplateConfig | null = null;
  private packageVersions: Record<string, string> = {};

  async run() {
    console.log(chalk.cyan("🎨 Duonordic Template Creator"));
    console.log(
      chalk.gray(
        "This will create a new template package for your multi-tenant platform\n"
      )
    );

    // Load package versions first
    await this.loadPackageVersions();

    await this.promptForConfig();
    await this.validateConfig();
    await this.createTemplate();
    await this.updatePlanIndex();
    await this.updateRegistry();
    await this.updateRootPackageJson();

    this.showSuccessMessage();
  }

  private async loadPackageVersions() {
    const lockfilePath = path.join(process.cwd(), "..", "..", "pnpm-lock.yaml");

    if (!fs.existsSync(lockfilePath)) {
      console.log(
        chalk.yellow("⚠️  pnpm-lock.yaml not found, using default versions")
      );
      this.packageVersions = this.getDefaultVersions();
      return;
    }

    try {
      const lockfileContent = fs.readFileSync(lockfilePath, "utf8");
      const lockfile = yaml.load(lockfileContent) as LockfileContent;

      const versions: Record<string, string> = {};

      // Extract versions from packages section (pnpm v6+ format)
      if (lockfile.packages) {
        for (const [pkgPath, pkgInfo] of Object.entries(lockfile.packages)) {
          const pkgNameMatch = pkgPath.match(/\/(@[^\/]+\/[^\/]+|[^\/]+)\/\d/);
          if (pkgNameMatch && pkgInfo.version) {
            const pkgName = pkgNameMatch[1];
            versions[pkgName as keyof typeof versions] = pkgInfo.version;
          }
        }
      }

      // Also check importers for workspace packages (pnpm v7+ format)
      if (lockfile.importers) {
        for (const importer of Object.values(lockfile.importers)) {
          if (importer.dependencies) {
            for (const [pkgName, pkgInfo] of Object.entries(
              importer.dependencies
            )) {
              if (
                pkgInfo.version &&
                !pkgInfo.version.startsWith("workspace:")
              ) {
                versions[pkgName] = pkgInfo.version;
              }
            }
          }
          if (importer.devDependencies) {
            for (const [pkgName, pkgInfo] of Object.entries(
              importer.devDependencies
            )) {
              if (
                pkgInfo.version &&
                !pkgInfo.version.startsWith("workspace:")
              ) {
                versions[pkgName] = pkgInfo.version;
              }
            }
          }
        }
      }

      this.packageVersions = { ...this.getDefaultVersions(), ...versions };
      console.log(
        chalk.gray(
          `📦 Found ${Object.keys(versions).length} package versions from lockfile`
        )
      );
    } catch (error) {
      console.log(
        chalk.yellow(
          "⚠️  Failed to read pnpm-lock.yaml, using default versions"
        )
      );
      this.packageVersions = this.getDefaultVersions();
    }
  }

  private getDefaultVersions(): Record<string, string> {
    return {
      react: "^19.1.1",
      "react-dom": "^19.1.1",
      typescript: "^5.3.3",
    };
  }

  private createPackageJson(config: TemplateConfig) {
    return {
      name: `@dn/templates-${config.plan}-${config.id}`,
      version: "1.0.0",
      type: "module" as const,
      private: true,
      main: "./src/index.ts",
      types: "./src/index.ts",
      scripts: {
        build: "tsc",
        dev: "tsc --watch",
        lint: "eslint src --ext .ts,.tsx",
      },

      devDependencies: {
        "@dn/ui": "workspace:*",
        react: this.packageVersions.react,
        next: this.packageVersions.next,
        "next-sanity": this.packageVersions["next-sanity"],
        "next-themes": this.packageVersions["next-themes"],
        "sanity-image": this.packageVersions["sanity-image"],
        "lucide-react": this.packageVersions["lucide-react"],
        zod: this.packageVersions.zod,
        "react-dom": this.packageVersions["react-dom"],
        "@dn/typescript-config": "workspace:*",
        "@dn/eslint-config": "workspace:*",
        typescript: this.packageVersions.typescript,
      },
      files: ["src/**/*"],
    };
  }

  private createTsConfig(config: TemplateConfig) {
    return {
      extends: "@dn/typescript-config/nextjs.json",
      compilerOptions: {
        baseUrl: ".",
        "@dn/ui/*": ["./src/*"],
      },
      include: ["."],
      exclude: ["node_modules", "dist"],
      composite: true,
      declarationMap: true,
    };
  }

  // Template file content generators
  private createTemplateFiles(config: TemplateConfig) {
    const templateExportName =
      config.id.replace(/-/g, "_").toUpperCase() + "_TEMPLATE";

    return {
      // Main template configuration
      "src/template.ts": `import { TemplateConfig } from "@dn/templates/types";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { PageBuilder } from "./components/PageBuilder";

export const ${templateExportName}: TemplateConfig = {
  id: "${config.id}",
  name: "${config.name}",
  description: "${config.description}",
  category: "${config.category}",
  plan: "${config.plan}",
  components: {
    Layout,
    HomePage,
    PageBuilder,
  },
  previewImage: "/templates/${config.plan}/${config.id}-preview.jpg",
  supportedPages: ["home", "about", "contact"],
  seoConfig: {
    defaultTitle: "${config.name}",
    defaultDescription: "${config.description}",
  },
};`,

      // Index file
      "src/index.ts": `export { ${templateExportName} } from './template';
export { Layout } from './components/Layout';
export { HomePage } from './components/HomePage';
export { PageBuilder } from './components/PageBuilder';
`,

      // Components
      "src/components/Layout.tsx": `import React from 'react';
import { TemplateComponentProps } from "@dn/templates/types";

export const Layout = ({ tenant, children }: TemplateComponentProps) => (
  <div className="min-h-screen bg-white">
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">${config.name}</h1>
      </div>
    </header>
    <main>{children}</main>
    <footer className="border-t mt-8">
      <div className="container mx-auto px-4 py-4 text-center">
        © {new Date().getFullYear()} {tenant.domain}
      </div>
    </footer>
  </div>
);`,

      "src/components/HomePage.tsx": `import React from 'react';
import { TemplateComponentProps } from "@dn/templates/types";

export const HomePage = ({ tenant, pageData }: TemplateComponentProps) => (
  <div className="container mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold mb-8">Welcome to ${config.name}</h2>
    <p className="text-lg text-gray-600">
      This is your new ${config.name} template.
    </p>
  </div>
);`,

      "src/components/PageBuilder.tsx": `import React from 'react';
import { PageBuilderProps } from "@dn/templates/types";

export const PageBuilder = ({ pageBuilder, id, type, tenantProjectId }: PageBuilderProps) => (
  <div className="space-y-8">
    {pageBuilder?.map((block: any) => (
      <section key={block._key} className="template-section">
        {/* Add your block rendering logic here */}
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </section>
    ))}
  </div>
);`,

      // Schema
      "src/schema.ts": `// Sanity schema definitions for ${config.name} template
export const ${config.id.replace(/-/g, "_")}Schema = {
  name: '${config.id}',
  title: '${config.name}',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
};`,

      // README
      "README.md": `# ${config.name} Template

A ${config.plan}-level template for the Duonordic platform.

## Package Structure

This template is a standalone package that can be imported as:
\`\`\`typescript
import { ${templateExportName} } from "@dn/templates/${config.plan}/${config.id}";
// or
import { ${templateExportName} } from "@dn/templates/${config.plan}";
\`\`\`

## Features

- Modern design
- Responsive layout
- SEO optimized
- Easy to customize

## Development

\`\`\`bash
cd packages/templates/${config.plan}/${config.id}
pnpm dev    # Watch mode
pnpm build  # Build package
pnpm lint   # Lint code
\`\`\`
`,
    };
  }

  private async promptForConfig() {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "plan",
        message: "Which plan should this template belong to?",
        choices: PLANS.map((plan) => ({
          name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
          value: plan,
        })),
        default: "basic",
      },
      {
        type: "input",
        name: "name",
        message: "Template display name:",
        validate: (input: string) => input.length > 0 || "Name is required",
      },
      {
        type: "input",
        name: "id",
        message: 'Template ID (kebab-case, e.g., "modern-portfolio"):',
        validate: (input: string) => {
          if (!input) return "ID is required";
          if (!/^[a-z0-9-]+$/.test(input))
            return "ID must be kebab-case (lowercase letters, numbers, hyphens)";
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "Template description:",
        validate: (input: string) =>
          input.length > 0 || "Description is required",
      },
      {
        type: "input",
        name: "category",
        message: 'Template category (e.g., "portfolio", "blog", "ecommerce"):',
        default: "general",
      },
      {
        type: "input",
        name: "author",
        message: "Author name:",
        default: "Duonordic Team",
      },
    ]);

    this.config = answers as TemplateConfig;
  }

  private async validateConfig() {
    if (!this.config) throw new Error("Configuration not set");

    const templatePath = this.getTemplatePath();
    if (fs.existsSync(templatePath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `Template "${this.config.id}" already exists. Overwrite?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.yellow("Template creation cancelled."));
        process.exit(0);
      }
    }
  }

  private getTemplatePath(): string {
    if (!this.config) throw new Error("Configuration not set");
    return path.join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "templates",
      this.config.plan,
      this.config.id
    );
  }

  private getPlanPath(): string {
    if (!this.config) throw new Error("Configuration not set");
    return path.join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "templates",
      this.config.plan
    );
  }

  private async createTemplate() {
    if (!this.config) throw new Error("Configuration not set");

    const templatePath = this.getTemplatePath();
    fs.mkdirSync(templatePath, { recursive: true });

    // Create package.json
    const packageJson = this.createPackageJson(this.config);
    fs.writeFileSync(
      path.join(templatePath, "package.json"),
      JSON.stringify(packageJson, null, 2),
      "utf8"
    );
    console.log(chalk.green("✓ Created package.json"));

    // Create tsconfig.json
    const tsConfig = this.createTsConfig(this.config);
    fs.writeFileSync(
      path.join(templatePath, "tsconfig.json"),
      JSON.stringify(tsConfig, null, 2),
      "utf8"
    );
    console.log(chalk.green("✓ Created tsconfig.json"));

    // Create template files
    const templateFiles = this.createTemplateFiles(this.config);
    for (const [filePath, content] of Object.entries(templateFiles)) {
      const fullPath = path.join(templatePath, filePath);
      const dirName = path.dirname(fullPath);

      fs.mkdirSync(dirName, { recursive: true });
      fs.writeFileSync(fullPath, content, "utf8");
      console.log(chalk.green(`✓ Created ${filePath}`));
    }

    // Create preview image placeholder
    const publicDir = path.join(templatePath, "public");
    fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(
      path.join(publicDir, `${this.config.id}-preview.jpg`),
      "// Placeholder for template preview image"
    );
    console.log(chalk.green("✓ Created preview image placeholder"));
  }

  private async updatePlanIndex() {
    if (!this.config) throw new Error("Configuration not set");

    const planPath = this.getPlanPath();
    const indexPath = path.join(planPath, "index.ts");
    const templateExportName =
      this.config.id.replace(/-/g, "_").toUpperCase() + "_TEMPLATE";
    const importStatement = `export { ${templateExportName} } from '@dn/templates-${this.config.plan}-${this.config.id}';`;

    fs.mkdirSync(planPath, { recursive: true });

    if (fs.existsSync(indexPath)) {
      let indexContent = fs.readFileSync(indexPath, "utf8");
      if (
        !indexContent.includes(
          `@dn/templates-${this.config.plan}-${this.config.id}`
        )
      ) {
        indexContent += `\n${importStatement}`;
        fs.writeFileSync(indexPath, indexContent, "utf8");
        console.log(chalk.green(`✓ Updated ${this.config.plan}/index.ts`));
      }
    } else {
      const indexContent = `// Export all ${this.config.plan} plan templates\n${importStatement}\n`;
      fs.writeFileSync(indexPath, indexContent, "utf8");
      console.log(chalk.green(`✓ Created ${this.config.plan}/index.ts`));
    }
  }

  private async updateRegistry() {
    if (!this.config) throw new Error("Configuration not set");

    const registryPath = path.join(
      process.cwd(),
      "..",
      "..",
      "apps",
      "web",
      "lib",
      "templates",
      "registry.ts"
    );
    if (!fs.existsSync(registryPath)) {
      console.log(
        chalk.yellow("⚠️  Registry file not found, skipping registry update")
      );
      return;
    }

    let registryContent = fs.readFileSync(registryPath, "utf8");
    const templateExportName =
      this.config.id.replace(/-/g, "_").toUpperCase() + "_TEMPLATE";
    const importStatement = `import { ${templateExportName} } from "@dn/templates/${this.config.plan}";`;

    if (!registryContent.includes(importStatement)) {
      const importRegex = /import.*from.*;(\r?\n)/g;
      const matches = registryContent.match(importRegex);
      if (matches && matches.length > 0) {
        const lastImport = matches[matches.length - 1];
        if (lastImport) {
          registryContent = registryContent.replace(
            lastImport,
            lastImport + importStatement + "\n"
          );
        }
      } else {
        registryContent = importStatement + "\n\n" + registryContent;
      }
    }

    const templateEntry = `  "${this.config.id}": ${templateExportName},`;
    if (!registryContent.includes(`"${this.config.id}":`)) {
      const registryRegex =
        /const templateRegistry: Record<string, TemplateConfig> = {([^}]*)}/s;
      const match = registryContent.match(registryRegex);
      if (match && match[1]) {
        const existingContent = match[1].trim();
        const newContent = existingContent
          ? existingContent + "\n" + templateEntry
          : templateEntry;
        registryContent = registryContent.replace(
          match[1],
          "\n" + newContent + "\n"
        );
      }
    }

    fs.writeFileSync(registryPath, registryContent, "utf8");
    console.log(chalk.green("✓ Updated template registry"));
  }

  private async updateRootPackageJson() {
    if (!this.config) throw new Error("Configuration not set");

    const rootPackagePath = path.join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "templates",
      "package.json"
    );

    let rootPackage = {
      name: "@dn/templates",
      version: "1.0.0",
      type: "module",
      private: true,
      workspaces: ["basic/*", "business/*", "enterprise/*"],
      exports: {} as Record<string, string>,
      scripts: {
        build: "turbo run build",
        dev: "turbo run dev --parallel",
      },
    };

    if (fs.existsSync(rootPackagePath)) {
      rootPackage = {
        ...rootPackage,
        ...JSON.parse(fs.readFileSync(rootPackagePath, "utf8")),
      };
    }

    // Add export for this template
    rootPackage.exports[`./${this.config.plan}/${this.config.id}`] =
      `./${this.config.plan}/${this.config.id}/src/index.ts`;

    fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2));
    console.log(chalk.green("✓ Updated root templates package.json"));
  }

  private showSuccessMessage() {
    if (!this.config) throw new Error("Configuration not set");

    console.log(
      "\n" + chalk.green("🎉 Template package created successfully!")
    );
    console.log(chalk.cyan("\nNext steps:"));
    console.log(
      `1. cd packages/templates/${this.config.plan}/${this.config.id}`
    );
    console.log(`2. pnpm install`);
    console.log(`3. pnpm dev # Start development`);
    console.log(`4. Customize the template components`);
  }
}

// Run the CLI
async function main() {
  try {
    const creator = new TemplateCreator();
    await creator.run();
  } catch (error) {
    console.error(chalk.red("❌ Error creating template:"), error);
    process.exit(1);
  }
}

main();
