// Update with your config settings.

module.exports = {

  development: {
    client: 'postgres',
    connection: {
      database: 'cultivato',
      user:     'postgres',
      password: 'postgres'
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'cultivato',
      user:     'postgres',
      password: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'cultivato',
      user:     'postgres',
      password: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
