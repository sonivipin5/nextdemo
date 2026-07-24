module.exports = {
  apps: [
    {
      name: "myapp",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "D:/projects/other/my-app",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 3000            // change if your app uses a different port
      }
    },
    {
      name: "deploy-watcher",
      script: "./auto-deploy.js",
      cwd: "D:/projects/other/my-app",
      watch: false,
      autorestart: true
    }
  ]
};