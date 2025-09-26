#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";

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

// Template file structure
const TEMPLATE_FILES = {
  // Main template configuration
  "template.ts": (
    config: TemplateConfig
  ) => `import { TemplateConfig } from "@/lib/templates/types";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { PageBuilder } from "./components/PageBuilder";

export const ${config.id.replace(/-/g, "_").toUpperCase()}_TEMPLATE: TemplateConfig = {
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
};
`,

  // Index file
  "index.ts": (
    config: TemplateConfig
  ) => `export { ${config.id.replace(/-/g, "_").toUpperCase()}_TEMPLATE } from './template';
export * from './components';
`,

  // Components
  "components/Layout.tsx": (
    config: TemplateConfig
  ) => `import React from 'react';
import { TemplateComponentProps } from "@/lib/templates/types";

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
);
`,

  "components/HomePage.tsx": (
    config: TemplateConfig
  ) => `import React from 'react';
import { TemplateComponentProps } from "@/lib/templates/types";

export const HomePage = ({ tenant, pageData }: TemplateComponentProps) => (
  <div className="container mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold mb-8">Welcome to ${config.name}</h2>
    <p className="text-lg text-gray-600">
      This is your new ${config.name} template.
    </p>
    {pageData?.pageBuilder && (
      <PageBuilder
        pageBuilder={pageData.pageBuilder}
        id={pageData._id}
        type={pageData._type}
        tenantProjectId={tenant.sanityProjectId}
      />
    )}
  </div>
);
`,

  "components/PageBuilder.tsx": (
    config: TemplateConfig
  ) => `import React from 'react';
import { PageBuilderProps } from "@/lib/templates/types";

export const PageBuilder = ({ pageBuilder, id, type, tenantProjectId }: PageBuilderProps) => (
  <div className="space-y-8">
    {pageBuilder?.map((block: any) => (
      <section key={block._key} className="template-section">
        {/* Add your block rendering logic here */}
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </section>
    ))}
  </div>
);
`,

  "components/index.ts": (
    config: TemplateConfig
  ) => `export { Layout } from './Layout';
export { HomePage } from './HomePage';
export { PageBuilder } from './PageBuilder';
`,

  // Schema
  "schema.ts": (
    config: TemplateConfig
  ) => `// Sanity schema definitions for ${config.name} template
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
    // Add more fields as needed for your template
  ],
};
`,

  // README
  "README.md": (config: TemplateConfig) => `# ${config.name} Template

A ${config.plan}-level template for the Duonordic platform.

## Features

- Modern design
- Responsive layout
- SEO optimized
- Easy to customize

## Supported Pages

- Home
- About
- Contact

## Usage

This template is automatically available for users on the ${config.plan} plan.

## Customization

To customize this template, edit the components in this directory.

## Sanity Schema

This template includes a basic Sanity schema. Extend it as needed for your content requirements.
`,
};

class TemplateCreator {
  private config: TemplateConfig | null = null;

  async run() {
    console.log(chalk.cyan("🎨 Duonordic Template Creator"));
    console.log(
      chalk.gray(
        "This will create a new template for your multi-tenant platform\n"
      )
    );

    await this.promptForConfig();
    await this.validateConfig();
    await this.createTemplate();
    await this.updatePlanIndex();
    await this.updateRegistry();

    this.showSuccessMessage();
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

    const templatesDir = path.join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "templates"
    );
    return path.join(templatesDir, this.config.plan, this.config.id);
  }

  private getPlanPath(): string {
    if (!this.config) throw new Error("Configuration not set");

    const templatesDir = path.join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "templates"
    );
    return path.join(templatesDir, this.config.plan);
  }

  private async createTemplate() {
    if (!this.config) throw new Error("Configuration not set");

    const templatePath = this.getTemplatePath();

    // Create template directory
    fs.mkdirSync(templatePath, { recursive: true });

    // Create each template file
    for (const [filePath, generator] of Object.entries(TEMPLATE_FILES)) {
      const fullPath = path.join(templatePath, filePath);
      const dirName = path.dirname(fullPath);

      // Create directory if it doesn't exist
      fs.mkdirSync(dirName, { recursive: true });

      const content = generator(this.config);
      fs.writeFileSync(fullPath, content, "utf8");
      console.log(chalk.green(`✓ Created ${filePath}`));
    }

    // Create preview image placeholder
    const previewDir = path.join(templatePath, "public");
    fs.mkdirSync(previewDir, { recursive: true });
    fs.writeFileSync(
      path.join(previewDir, `${this.config.id}-preview.jpg`),
      "// Placeholder for template preview image"
    );
  }

  private async updatePlanIndex() {
    if (!this.config) throw new Error("Configuration not set");

    const planPath = this.getPlanPath();
    const indexPath = path.join(planPath, "index.ts");

    // Ensure plan directory exists
    fs.mkdirSync(planPath, { recursive: true });

    const templateExportName =
      this.config.id.replace(/-/g, "_").toUpperCase() + "_TEMPLATE";
    const importStatement = `export { ${templateExportName} } from './${this.config.id}';`;

    if (fs.existsSync(indexPath)) {
      // Read existing index file
      let indexContent = fs.readFileSync(indexPath, "utf8");

      // Check if export already exists
      if (!indexContent.includes(`'./${this.config.id}'`)) {
        // Add new export
        indexContent += `\n${importStatement}`;
        fs.writeFileSync(indexPath, indexContent, "utf8");
        console.log(chalk.green(`✓ Updated ${this.config.plan}/index.ts`));
      } else {
        console.log(
          chalk.yellow(
            `⚠️  Export already exists in ${this.config.plan}/index.ts`
          )
        );
      }
    } else {
      // Create new index file
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

    // Add import statement
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
        // No imports found, add at the beginning
        registryContent = importStatement + "\n\n" + registryContent;
      }
    }

    // Add to templateRegistry
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

  private showSuccessMessage() {
    if (!this.config) throw new Error("Configuration not set");

    console.log("\n" + chalk.green("🎉 Template created successfully!"));
    console.log(chalk.cyan("\nTemplate structure:"));
    console.log(`📁 templates/${this.config.plan}/${this.config.id}/`);
    console.log(`   ├── components/`);
    console.log(`   │   ├── Layout.tsx`);
    console.log(`   │   ├── HomePage.tsx`);
    console.log(`   │   ├── PageBuilder.tsx`);
    console.log(`   │   └── index.ts`);
    console.log(`   ├── public/`);
    console.log(`   │   └── ${this.config.id}-preview.jpg`);
    console.log(`   ├── template.ts`);
    console.log(`   ├── schema.ts`);
    console.log(`   ├── index.ts`);
    console.log(`   └── README.md`);

    console.log(chalk.cyan("\nNext steps:"));
    console.log(`1. Customize the template components`);
    console.log(`2. Add a real preview image`);
    console.log(`3. Extend the Sanity schema if needed`);
    console.log(
      `4. Build the templates package: ${chalk.cyan("pnpm run build")}`
    );
    console.log(`5. Test the template in your dashboard`);

    console.log(chalk.gray("\nThe template is now ready for development."));

    console.log(chalk.cyan("\nImport usage:"));
    console.log(`${chalk.gray("// Import specific template")}`);
    console.log(
      `import { ${this.config.id.replace(/-/g, "_").toUpperCase()}_TEMPLATE } from '@dn/templates/${this.config.plan}';`
    );
    console.log(`${chalk.gray("// Import all from plan")}`);
    console.log(
      `import * as ${this.config.plan}Templates from '@dn/templates/${this.config.plan}';`
    );
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
