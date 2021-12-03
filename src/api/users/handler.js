const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-trailing-spaces */
class UsersHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler({ payload }, h) {
    try {
      this._validator.validateUserPayload(payload);

      const { username, password, fullname } = payload;
      const userId = await this._services.addUser(username, password, fullname);
  
      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          userId,
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
        message: 'terjadi kesalahan di server kami',
      });
      response.code(500);
      console.log(e);
      return response;
    }
  }
}

module.exports = UsersHandler;
