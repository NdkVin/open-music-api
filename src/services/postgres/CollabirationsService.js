const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addColaboration({ playlistId, userId }) {
    await this.verifyNewUserCollaboration(playlistId, userId);
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING ID',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Tidak dapat menambahkan collaboration');
    }

    return result.rows[0].id;
  }

  async verifyNewUserCollaboration(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE user_id = $1 AND playlist_id = $2',
      values: [userId, playlistId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('User tersebut telah ditambahkan ke collaborations');
    }
  }

  async deleteColaboration({ playlistId, userId }) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING Id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('tidak dapat menghapus konten ini');
    }
  }

  async verifyCollaboration(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE user_id = $1 AND playlist_id = $2',
      values: [userId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Anda bukan kolabolator');
    }
  }
}

module.exports = CollaborationsService;
