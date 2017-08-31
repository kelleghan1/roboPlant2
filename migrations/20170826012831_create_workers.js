exports.up = function(knex, Promise) {
  return knex.schema.createTable('workers', function(table){

    // knex docs references index  ondelete  onupdate  cascade
    table.increments('worker_id');
    table.integer('client_id').notNullable().references('client_id').inTable('clients').onDelete('cascade').onUpdate('cascade');
    table.string('worker_name');
    table.boolean('active').defaultTo(0);

  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('workers');
};
