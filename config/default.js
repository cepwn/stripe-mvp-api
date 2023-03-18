module.exports = {
  postgres: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'stripe_mvp_api_user',
    password: 'stripe_mvp_api_pass',
    database: 'stripe_mvp_api',
    autoLoadModels: true,
  },
  jwt: {
    secret: 'stripe_mvp_api_jwt_secret',
    expiresIn: '6h',
  },
};
