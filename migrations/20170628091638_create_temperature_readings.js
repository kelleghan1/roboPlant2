exports.up = function(knex, Promise) {
  return knex.schema.createTable('temperature_readings', function(table){

    // knex docs references index  ondelete  onupdate  cascade
    table.increments('temperature_reading_id');
    table.integer('module_id').notNullable().references('module_id').inTable('modules').onDelete('cascade').onUpdate('cascade');
    table.decimal('temperature_reading');
    table.integer('sensor_id');
    table.timestamp('time');

  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('temperature_readings');
};
