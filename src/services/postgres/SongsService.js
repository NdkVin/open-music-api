const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDbToModel } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  // add song
  async addSong({
    title, year, performer, genre, duration,
  }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan data');
    }

    return result.rows[0].id;
  }

  // get all songs
  async getSongs() {
    const songs = await this._pool.query('SELECT id, title, performer FROM songs');
    return songs.rows.map(mapDbToModel);
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    const song = await this._pool.query(query);

    if (!song.rows.length) {
      throw new NotFoundError('Song not found');
    }
    return song.rows.map(mapDbToModel)[0];
  }
}

module.exports = SongsService;
