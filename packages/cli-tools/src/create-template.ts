import * as inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import { fileURLToPath } from "url";

import {
  NEXT_CONFIG_TS_TEMPLATE,
  GITIGNORE_TEMPLATE,
  CREATE_NEXTJS_ROOT,
  CREATE_PACKAGE_JSON,
  CREATE_TSCONFIG,
  SAMPLE_PAGE_TEMPLATE,
  INDEX_CSS_TEMPLATE,
} from "./template-boilers.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_PATH = path.join(__dirname, "../../../templates/");

interface TemplateAnswers {
  plan: string;
  templateName: string;
}

async function createTemplate(): Promise<void> {
  console.log(chalk.blue.bold("✨ Welcome to the Template Creation CLI ✨"));

  // Fixed: Use proper Inquirer question types
  const questions: inquirer.DistinctQuestion<TemplateAnswers>[] = [
    {
      type: "list" as const,
      name: "plan",
      message: "Which plan is this template for?",
      choices: ["Basic", "Business", "Enterprise"],
      default: "Basic",
    },
    {
      type: "input" as const,
      name: "templateName",
      message: "Enter the name of the new template:",
      validate: (input: string) => {
        if (!input) return "Template name cannot be empty.";
        // Check the full path including the plan
        const planPath = path.join(TEMPLATES_PATH, "Basic");
        const templatePath = path.join(planPath, input);
        if (fs.existsSync(templatePath)) {
          return `A template with the name "${input}" already exists in the selected plan.`;
        }
        return true;
      },
    },
  ];

  const answers = await inquirer.default.prompt<TemplateAnswers>(questions);
  const { templateName, plan } = answers;

  // Construct the new path with the plan directory
  const newTemplatePath = path.join(TEMPLATES_PATH, plan, templateName);

  console.log(
    chalk.yellow(`\nCreating ${plan} template at: ${newTemplatePath}`)
  );

  try {
    // 1. Create the plan directory if it doesn't exist, then the template directory
    fs.mkdirSync(newTemplatePath, { recursive: true });

    // 2. Create the boilerplate files
    const packageJson = CREATE_PACKAGE_JSON(templateName);
    const tsConfig = CREATE_TSCONFIG(templateName);

    fs.writeFileSync(path.join(newTemplatePath, "package.json"), packageJson);
    fs.writeFileSync(path.join(newTemplatePath, "tsconfig.json"), tsConfig);
    fs.writeFileSync(
      path.join(newTemplatePath, "next.config.ts"),
      NEXT_CONFIG_TS_TEMPLATE
    );
    fs.writeFileSync(
      path.join(newTemplatePath, ".gitignore"),
      GITIGNORE_TEMPLATE
    );

    // 3. Create the src directory and a sample page
    const srcPath = path.join(newTemplatePath, "src");
    fs.mkdirSync(srcPath);
    fs.mkdirSync(path.join(srcPath, "app"));
    fs.writeFileSync(
      path.join(srcPath, "app/layout.tsx"),
      CREATE_NEXTJS_ROOT(templateName)
    );
    fs.writeFileSync(
      path.join(srcPath, "app/page.tsx"),
      SAMPLE_PAGE_TEMPLATE(templateName)
    );
    fs.writeFileSync(path.join(srcPath, "index.css"), INDEX_CSS_TEMPLATE);

    console.log(chalk.green("✅ Template files created successfully."));
    console.log(
      chalk.cyan("📦 Running pnpm install to update package-lock.json...")
    );

    // 4. Run pnpm install at the monorepo root
    execSync("pnpm install", { stdio: "inherit" });

    console.log(
      chalk.green("\n🎉 Template created and dependencies synchronized!")
    );
    console.log(
      chalk.bold(
        `\nTo get started, navigate to the new template's directory and run:`
      )
    );
    console.log(
      chalk.yellow(`pnpm run dev --filter @dn/template-${templateName}`)
    );
  } catch (error) {
    console.error(
      chalk.red("❌ An error occurred during template creation:"),
      error
    );
    // Clean up the created directory if an error occurs
    fs.rmSync(newTemplatePath, { recursive: true, force: true });
    process.exit(1);
  }
}

createTemplate().catch((error) => {
  console.error(chalk.red("❌ Unexpected error:"), error);
  process.exit(1);
});
