const InvariantError = require('../../exceptions/InvariantError');
const {
  PlaylistPayloadSchema,
  PostSongToPlaylistSchema,
  DeleteSongsOnPlaylistSchema,
} = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validateResult = PlaylistPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },

  validatePostSongToPayload: (payload) => {
    const validateResult = PostSongToPlaylistSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },

  validateDeleteSongsOnPayload: (payload) => {
    const validateResult = DeleteSongsOnPlaylistSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
