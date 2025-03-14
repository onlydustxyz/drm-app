import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

async function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.warn(`Command stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}

async function main() {
  console.log("Initializing Drizzle migrations...");
  
  // Create migrations directory if it doesn't exist
  const migrationsDir = path.join(process.cwd(), "lib", "drizzle", "migrations");
  if (!fs.existsSync(migrationsDir)) {
    console.log("Creating migrations directory...");
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  try {
    // Generate initial migration from schema
    console.log("Generating initial migration from schema...");
    await runCommand("npm run db:generate");
    
    console.log("Initialization complete!");
    console.log("\nYou can now run migrations with:");
    console.log("npm run db:migrate");
    console.log("\nOr view your database with Drizzle Studio:");
    console.log("npm run db:studio");
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
}

main(); 