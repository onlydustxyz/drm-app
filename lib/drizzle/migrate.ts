import { migrate } from "drizzle-orm/postgres-js/migrator";
import { dbFactory } from "./index";

// Run migrations
async function main() {
  console.log("Running migrations...");
  
  try {
    // Get the DB client from the factory
    const db = dbFactory.getClient();
    
    await migrate(db, { migrationsFolder: process.cwd() + "/postgres/migrations" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

main(); 