module.exports = {
  apps: [
    {
      name: 'kpmg-api',
      script: './server.js',
      watch: true,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
