const ClientError = require('../../exceptions/ClientError');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler({ payload }, h) {
    try {
      this._validator.validatePostAuthenticationPayload(payload);
      const { username, password } = payload;

      const id = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
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
        message: 'sedang terjadi error di server kami',
      });
      response.code(500);
      console.log(e);
      return response;
    }
  }

  async putAuthenticationHandler({ payload }, h) {
    try {
      this._validator.validatePutAuthenticationPayload(payload);
      const { refreshToken } = payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil diperbarui',
        data: {
          accessToken,
        },
      });
      response.code(200);
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
        message: 'sedang terjadi error di server kami',
      });
      response.code(500);
      console.log(e);
      return response;
    }
  }

  async deleteAuthenticationHandler({ payload }, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(payload);
      const { refreshToken } = payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);
      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
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
        message: 'sedang terjadi error di server kami',
      });
      response.code(500);
      console.log(e);
      return response;
    }
  }
}

module.exports = AuthenticationsHandler;
