import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  // GitHub Pages 项目站点挂在 /<仓库名>/ 下，由部署工作流通过 BASE_PATH 传入；本地默认根路径。
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  server: { host: "127.0.0.1" },
  test: { include: ["src/**/*.test.ts"] },
});
