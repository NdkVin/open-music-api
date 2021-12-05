const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    try {
      this._validator.validatePlaylistPayload(payload);
      const { id: credentialId } = auth.credentials;
      const { name } = payload;

      const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      if (e instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: e.message,
        });
        response.code(e.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: e.message,
      });
      response.code(500);
      return response;
    }
  }

  async getPlaylistHandler({ auth }, h) {
    try {
      const { id: credentialId } = auth.credentials;
      const playlists = await this._service.getPlaylists(credentialId);

      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    } catch (e) {
      if (e instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: e.message,
        });
        response.code(e.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: e.message,
      });
      response.code(500);
      return response;
    }
  }

  async deletePlaylistByIdHandler({ params, auth }, h) {
    try {
      const { playlistId } = params;
      const { id: credentialId } = auth.credentials;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.deletePlaylistById(playlistId);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (e) {
      if (e instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: e.message,
        });
        response.code(e.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: e.message,
      });
      response.code(500);
      return response;
    }
  }

  async postSongToPlaylistHandler({ payload, params, auth }, h) {
    try {
      this._validator.validatePostSongToPayload(payload);

      const { playlistId } = params;
      const { id: credentialId } = auth.credentials;
      const { songId } = payload;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.addSongToPlaylist(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (e) {
      if (e instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: e.message,
        });
        response.code(e.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: e.message,
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = PlaylistsHandler;
