import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Create a bin entry point
const binContent = `#!/usr/bin/env node
require('../dist/create-template.js');
`;

fs.writeFileSync(path.join(__dirname, "..", "bin.js"), binContent);
fs.chmodSync(path.join(__dirname, "..", "bin.js"), "755");

console.log("✅ CLI tool built successfully");
