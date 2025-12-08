import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectEslint = [ // Renamed to avoid conflict with local 'project'
  "./tsconfig.eslint.json"
];

const tsConfigWithProject = nextTs.map(config => {
  if (config.files && Array.isArray(config.files) && config.files.some(file => file.endsWith('.ts') || file.endsWith('.tsx'))) {
    return {
      ...config,
      languageOptions: {
        ...config.languageOptions,
        parserOptions: {
          ...config.languageOptions?.parserOptions,
          project: projectEslint, // Use the new projectEslint
          tsconfigRootDir: __dirname,
        },
      },
    };
  }
  return config;
});


const eslintConfig = defineConfig([
  // Override for test files to disable specific a11y rules that might be problematic with mocks
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "jsx-a11y/role-has-required-aria-props": "off",
    },
  },
  // Override for tailwind.config.js to allow CommonJS syntax
  {
    files: ["tailwind.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "import/no-commonjs": "off", // This rule might not be present, but good to have
      "no-undef": "off", // __dirname, module, exports are undef in ESM but fine in CJS
      "no-unused-vars": "off" // To ignore require() not being explicitly imported
    },
    languageOptions: {
      sourceType: "script",
      ecmaVersion: 2015,
      parser: "espree", // Explicitly set parser for plain JS
    },
  },
  ...nextVitals,
  ...tsConfigWithProject,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;