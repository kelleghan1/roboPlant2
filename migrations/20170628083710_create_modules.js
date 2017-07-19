exports.up = function(knex, Promise) {
  return knex.schema.createTable('modules', function(table){

    // knex docs references index  ondelete  onupdate  cascade
    table.increments('module_id');
    table.integer('client_id').notNullable().references('client_id').inTable('clients').onDelete('cascade').onUpdate('cascade');
    table.integer('sensor_id');
    table.integer('scale_id');
    table.string('module_name');
    table.string('module_type');
    table.string('module_notes', 250);

  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('modules');
};
