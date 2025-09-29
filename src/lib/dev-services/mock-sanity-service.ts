import fs from "fs-extra";
import path from "path";
import { nanoid } from "nanoid";

interface MockSanityProject {
  projectId: string;
  displayName: string;
  dataset: string;
  token: string;
  createdAt: Date;
}

export class MockSanityService {
  private projectsDir: string;

  constructor() {
    this.projectsDir = path.join(process.cwd(), ".dev-data", "sanity-projects");
    fs.ensureDirSync(this.projectsDir);
  }

  async createProject(
    tenantId: string,
    displayName: string
  ): Promise<MockSanityProject> {
    const projectId = `mock-${nanoid(10)}`;
    const token = `sk${nanoid(32)}`;

    const project: MockSanityProject = {
      projectId,
      displayName,
      dataset: "production",
      token,
      createdAt: new Date(),
    };

    // Create mock project directory with initial data
    const projectDir = path.join(this.projectsDir, projectId);
    await fs.ensureDir(projectDir);

    // Store project metadata
    await fs.writeJson(path.join(projectDir, "project.json"), project, {
      spaces: 2,
    });

    // Create mock content store
    await fs.writeJson(
      path.join(projectDir, "documents.json"),
      {
        pages: [],
        posts: [],
        settings: {
          _id: "siteSettings",
          _type: "siteSettings",
          title: displayName,
          description: `Welcome to ${displayName}`,
        },
      },
      { spaces: 2 }
    );

    console.log(`✅ Mock Sanity project created: ${projectId}`);
    return project;
  }

  async getProject(projectId: string): Promise<MockSanityProject | null> {
    const projectPath = path.join(this.projectsDir, projectId, "project.json");
    if (await fs.pathExists(projectPath)) {
      return await fs.readJson(projectPath);
    }
    return null;
  }

  async getDocuments(projectId: string) {
    const docsPath = path.join(this.projectsDir, projectId, "documents.json");
    if (await fs.pathExists(docsPath)) {
      return await fs.readJson(docsPath);
    }
    return null;
  }

  async deleteProject(projectId: string): Promise<void> {
    const projectDir = path.join(this.projectsDir, projectId);
    await fs.remove(projectDir);
    console.log(`🗑️  Mock Sanity project deleted: ${projectId}`);
  }
}
