import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      name: "mss-rehypekatex",
      fileName: "index",
    },
    rollupOptions: {
      plugins: [typescript({ rootDir: "./src" })],
    },
  },
});
