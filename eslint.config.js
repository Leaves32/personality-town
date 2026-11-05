import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "playwright-report", "test-results", "node_modules"] },
  {
    files: ["**/*.{ts,tsx,js}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser },
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
    ],
  },
  {
    files: ["*.config.{ts,js}", "tests/**/*.ts"],
    languageOptions: { globals: { ...globals.node } },
  },
  // 关闭与 Prettier 冲突的格式规则，放在最后。
  prettier,
);
