module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  plugins: ["@typescript-eslint"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"]
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"]
      }
    }
  },
  env: {
    node: true,
    browser: false,
    jest: true
  },
  rules: {
    "no-unused-vars": 0,
    "no-restricted-syntax": 0,
    "import/prefer-default-export": 0
  }
};
