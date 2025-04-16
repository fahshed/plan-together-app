import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ...compat.extends("plugin:@next/next/core-web-vitals"),
  ...compat.extends("airbnb"),
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    rules: {
      "no-console": "warn",
      "linebreak-style": "off", // Disable line ending checks
      quotes: "off", // Disable the quotes rule completely
      "react/react-in-jsx-scope": "off", // Not needed with Next.js
      "react/prop-types": "off", // Disable prop-types validation globally
    },
  },
];

export default eslintConfig;
