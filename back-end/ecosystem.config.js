module.exports = {
  apps: [
    {
      name: 'hshake',
      script: 'server.js',
      instances: 1,
      exec_mode: 'cluster',
      env_stage: {
        ENV_PATH: './.env',
        NODE_ENV: 'production',
        DEPLOY_ENV: 'development',
        PORT: 9000,
      },
      env_prod: {
        ENV_PATH: '/home/ubuntu/conf/.env',
        NODE_ENV: 'production',
        DEPLOY_ENV: 'production',
        PORT: 9000,
      },
    },
  ]
};
