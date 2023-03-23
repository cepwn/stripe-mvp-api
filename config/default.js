module.exports = {
  postgres: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    autoLoadModels: true,
  },
  jwt: {
    secret: 'stripe_mvp_api_jwt_secret',
    expiresIn: '1h',
  },
  stripe: {
    secretKey: null,
  },
};
