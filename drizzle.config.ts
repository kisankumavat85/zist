import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DIRECT_URL!, // This worked fast for db:push
		// url: process.env.DATABASE_URL!,
	},
});
