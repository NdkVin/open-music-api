const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postPlaylistsHandler = this.postPlaylistsHandler.bind(this);
  }

  async postPlaylistsHandler({ payload, params, auth }, h) {
    try {
      this._validator.validateExportPayload(payload);

      const { id: credentialId } = auth.credentials;
      const { playlistId } = params;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      const message = {
        playlistId,
        targetEmail: payload.targetEmail,
      };

      await this._producerService.sendMessage('exports: playlistsongs', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
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
        message: 'Sedang terjadi kesalahan di server kami',
      });
      response.code(500);
      console.log(e);
      return response;
    }
  }
}

module.exports = ExportsHandler;
