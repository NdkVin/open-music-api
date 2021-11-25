const ClientError = require('../../exceptions/ClientError');

/* eslint-disable class-methods-use-this */
class SongsHandler {
  constructor(service, validator) {
    this._services = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
  }

  // post song
  async postSongHandler(req, h) {
    try {
      this._validator.validateSongPayload(req.payload);
      const {
        title, year, performer, genre, duration,
      } = req.payload;
      const songId = await this._services.addSong({
        title, year, performer, genre, duration,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
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
        status: 'fail',
        message: e.message,
      });
      response.code(500);
      return response;
    }
  }

  // get all songs
  async getSongsHandler() {
    const songs = await this._services.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }
}

module.exports = SongsHandler;
