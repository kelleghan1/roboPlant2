exports.up = function(knex, Promise) {
  return knex.schema.createTable('modules', function(table){

    // knex docs references index  ondelete  onupdate  cascade
    table.increments('module_id').notNullable().references('client_id').inTable('clients').onDelete('cascade').onUpdate('cascade');
    table.string('module_name');
    table.string('module_type');
    table.string('module_notes');

  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('modules');
};
