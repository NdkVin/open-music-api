/* eslint-disable max-len */
const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationsHandler = this.postCollaborationsHandler.bind(this);
    this.deleteCollaborationsHandler = this.deleteCollaborationsHandler.bind(this);
  }

  async postCollaborationsHandler({ payload, auth }, h) {
    try {
      this._validator.validateCollaborationPayload(payload);

      const { id: credentialId } = auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(payload.playlistId, credentialId);
      const collaborationId = await this._collaborationsService.addColaboration(payload);

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          collaborationId,
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
      console.log(e);
      return response;
    }
  }

  async deleteCollaborationsHandler({ payload, auth }, h) {
    try {
      this._validator.validateCollaborationPayload(payload);

      const { id: credentialId } = auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(payload.playlistId, credentialId);
      await this._collaborationsService.deleteColaboration(payload);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
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
      console.log(e);
      return response;
    }
  }
}

module.exports = CollaborationsHandler;
