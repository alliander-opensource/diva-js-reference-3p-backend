exports.up = knex =>
  knex.schema.createTable('policy', (t) => {
    t.string('id').primary().notNull();
    t.string('service_provider').notNull();
    t.json('policy').notNull();
    t.string('message').notNull();
    t.json('irma_signature').notNull();
    t.jsonb('owner').notNull();
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
  });

exports.down = knex =>
  knex.schema.dropTable('policy');
