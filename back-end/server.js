const strapi = require('strapi');
strapi().start();

console.debug('-- DATABASE_HOST', process.env.DATABASE_HOST);
console.debug('-- DATABASE_PORT', process.env.DATABASE_PORT);
console.debug('-- DATABASE_NAME', process.env.DATABASE_NAME);
