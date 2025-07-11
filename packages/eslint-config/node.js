const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: ["eslint:recommended", "@typescript-eslint/recommended", "prettier"],
  plugins: ["@typescript-eslint"],
  globals: {
    Buffer: true,
    __dirname: true,
    __filename: true,
    console: true,
    exports: true,
    global: true,
    module: true,
    process: true,
    require: true,
  },
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
};