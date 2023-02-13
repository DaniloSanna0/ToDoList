import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import eslintPlugin from "vite-plugin-eslint";
import landingParamsPlugin from "@smart-contact/vite-plugin-landing-page-params";
import zip from "rollup-plugin-zip";
import landingConfig from "./landing.config";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    build: {},
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      LIVELANDING_CDN_IMAGES_BASE_URL: `"${landingConfig.cdnBaseURL}/images"`,
      LIVELANDING_CDN_JS_BASE_URL: `"${landingConfig.cdnBaseURL}/js"`,
      LIVELANDING_CDN_STYLES_BASE_URL: `"${landingConfig.cdnBaseURL}/styles"`,
      LIVELANDING_CDN_FILES_BASE_URL: `"${landingConfig.cdnBaseURL}/files"`,
      "process.env": process.env,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            `@import "bootstrap/scss/functions"`,
            `@import "@/assets/scss/vendors/bootstrap-vue/custom"`,
            `@import "bootstrap/scss/variables"`,
            `@import "bootstrap/scss/mixins"`,
            `@import "bootstrap-vue/src/variables"`,
            `@import "@smart-contact/smartify/src/scss/functions"`,
            `@import "@/assets/scss/vendors/smartify/custom"`,
            `@import "@smart-contact/smartify/src/scss/variables"`,
            `@import "@smart-contact/smartify/src/scss/mixins/layout"`,
            "",
          ].join(";\n"),
        },
      },
    },
    plugins: [
      landingParamsPlugin(),
      vue(),
      eslintPlugin({
        fix: true,
      }),
    ],
  };

  if (mode === "production") {
    config.base = landingConfig.cdnBaseURL + '/';
    config.build.assetsDir = landingConfig.name;
    config.plugins.push(zip());
  }

  return config;
});
