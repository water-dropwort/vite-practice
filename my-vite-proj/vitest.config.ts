import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	test: {
		include: ["src/**/*.test.{ts,tsx}"],
		environment: "jsdom",
		globals: true,
		setupFiles: "./vitest.setup.ts",
		reporters: process.env.GITHUB_ACTIONS
			? ["default", "github-actions"]
			: ["default"],
		coverage: {
			provider: "v8",
			reporter: ["text"],
			thresholds: {
				statements: 80,
				branches: 80,
				functions: 80,
				lines: 80,
			},
		},
	},
});
