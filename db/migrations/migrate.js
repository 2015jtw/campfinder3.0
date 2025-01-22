import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const pushMigrations = async () => {
  const migrationClient = postgres(process.env.NEXT_PUBLIC_SUPABASE_URL, {
    max: 1,
  });
  const migrationDb = drizzle(migrationClient);

  await migrate(migrationDb, {
    migrationsFolder: "./src/db/migrations/drizzle",
  });

  await migrationClient.end();
};

pushMigrations();
