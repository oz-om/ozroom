import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    // You can now use process.env.GRID_EXPERIMENTAL_ENABLED
    plugins: [react(), basicSsl()],
    define: {
      "process.env": process.env,
    },
    server: {
      host: "0.0.0.0",
      // https: {
      //   key: "./ssl/ozroom-privateKey.key",
      //   cert: "./ssl/ozroom.crt",
      // },
    },
  });
};
