module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:cypress/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
  globals: {
    LIVELANDING_CDN_CSS_BASE_URL: true,
    LIVELANDING_CDN_JS_BASE_URL: true,
    LIVELANDING_CDN_IMAGES_BASE_URL: true,
    LIVELANDING_CDN_FILES_BASE_URL: true,
  },
};
