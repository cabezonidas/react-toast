const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/index.tsx"],
    bundle: true,
    outfile: "dist/bundle.js",
    sourcemap: true,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    loader: {
      ".js": "jsx",
      ".ts": "ts",
      ".tsx": "tsx",
    },
    external: ["react", "react-dom"],
  })
  .catch(() => process.exit(1));
