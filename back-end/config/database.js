module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5441),
        database: env('DATABASE_NAME', 'handshake'),
        username: env('DATABASE_USERNAME', 'handshake'),
        password: env('DATABASE_PASSWORD', 'handshake'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {},
    },
  },
});
