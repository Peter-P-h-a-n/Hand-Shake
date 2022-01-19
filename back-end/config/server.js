module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('STRAPI_ADMIN_JWT_SECRET', '2905d2a06322dd2a9aa74ae97f6c2e56'),
    },
    watchIgnoreFiles: ['**/data/**'],
  },
  cron: {
    enabled: true,
  },
});
