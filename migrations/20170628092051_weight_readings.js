exports.up = function(knex, Promise) {
  return knex.schema.createTable('weight_readings', function(table){

    // knex docs references index  ondelete  onupdate  cascade
    table.increments('weight_reading_id');
    table.integer('module_id').notNullable().references('module_id').inTable('modules').onDelete('cascade').onUpdate('cascade');
    table.decimal('weight_reading');
    table.integer('sensor_id');
    table.timestamp('time');

  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('weight_readings');
};
