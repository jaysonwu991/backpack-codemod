import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        cli: resolve(__dirname, "src/cli.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        "@swc/core",
        "@swc/types",
        "glob",
        "yargs",
        "yargs/helpers",
        "fs",
        "path",
        "fs/promises",
        "util",
        "assert",
        "url",
      ],
    },
    target: "node18",
    minify: false,
  },
});
