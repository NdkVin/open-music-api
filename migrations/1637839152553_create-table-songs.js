/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      noNull: true,
    },
    year: {
      type: 'INTEGER',
      noNull: true,
    },
    performer: {
      type: 'TEXT',
      noNull: true,
    },
    genre: {
      type: 'TEXT',
      noNull: true,
    },
    duration: {
      type: 'INTEGER',
      noNull: true,
    },
    inserted_at: {
      type: 'TEXT',
      noNull: true,
    },
    updated_at: {
      type: 'TEXT',
      noNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
