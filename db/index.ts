import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.NEXT_PUBLIC_SUPABASE_URL!);
const db = drizzle({ client });

export default db;
