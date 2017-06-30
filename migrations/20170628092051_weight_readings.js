exports.up = function(knex, Promise) {
  return knex.schema.createTable('weight_readings', function(table){

    // knex docs references index  ondelete  onupdate  cascade
    table.integer('weight_reading_id').notNullable().references('module_id').inTable('modules').onDelete('cascade').onUpdate('cascade');
    table.integer('weight_reading');
    table.integer('sensor_id');

  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('weight_readings');
};
