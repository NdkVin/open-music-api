const InvariantError = require('../../exceptions/InvariantError');
const { ExportPayloadSchema } = require('./schema');

const ExportsValidator = {
  validateExportPayload: (payload) => {
    const validateResult = ExportPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
