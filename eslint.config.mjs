import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([".next/**", "next-env.d.ts", "public/**", "legacy/**", "*.tsx", "sw.js", "workbox-*.js"]),
  {
    files: ["src/components/**/*.tsx", "src/app/**/page.tsx"],
    ignores: ["src/app/dispatch/**", "src/app/sign-in/**"],
    rules: {
      "@next/next/no-html-link-for-pages": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "react-hooks/static-components": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn",
    },
  },
]);
