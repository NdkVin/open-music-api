const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const songId = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [songId, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('tidak dapat menambahkan playliust');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner=users.id WHERE playlists.owner = $1',
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists where id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak menghapus ini');
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }
}

module.exports = PlaylistService;
