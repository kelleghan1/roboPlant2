exports.up = function(knex, Promise) {
  return knex.schema.createTable('humidity_readings', function(table){

    // knex docs references index  ondelete  onupdate  cascade
    table.increments('humidity_reading_id');
    table.integer('module_id').notNullable().references('module_id').inTable('modules').onDelete('cascade').onUpdate('cascade');
    table.decimal('humidity_reading');
    table.integer('sensor_id');
    table.date('time');

  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('humidity_readings');
};
