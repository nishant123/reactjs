module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_PUBLIC_IP,
    dialect: "mysql",
    pool: { max: 10, min: 0, acquire: 60000, idle: 10000 },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_SANDBOX,
    host: process.env.DB_PUBLIC_IP,
    dialect: "mysql",
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: { socketPath: process.env.DB_CONNECTION_NAME },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_PUBLIC_IP,
    dialect: "mysql",
    pool: { max: 10, min: 0, acquire: 60000, idle: 10000 },
    dialectOptions: { socketPath: process.env.DB_CONNECTION_NAME },
  },
};
