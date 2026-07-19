import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { handleEliteAvailability } from "./api/elite-availability";

function eliteAvailabilityDevServer(env: Record<string, string>): Plugin {
  return {
    name: "elite-availability-dev-server",
    configureServer(server) {
      server.middlewares.use("/api/elite-availability", (request, response) => {
        void handleEliteAvailability(request, response, { env });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react(), eliteAvailabilityDevServer(env)],
    build: {
      target: "es2022",
      sourcemap: false,
      cssCodeSplit: true,
    },
  };
});
