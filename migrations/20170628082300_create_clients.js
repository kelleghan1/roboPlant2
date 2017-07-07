exports.up = function(knex, Promise) {
  return knex.schema.createTable('clients', function(table){

    table.increments('client_id').notNullable();
    table.string('client_name');

  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('clients');
};
