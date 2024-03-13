module.exports = {
  apps: [
    {
      name: "Shopsy",
      cwd: "./",
      script: "./server.js",
      // watch: true,
      watch: false,
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      instances: 1,
      exec_mode: "cluster",
    },
  ],
};
