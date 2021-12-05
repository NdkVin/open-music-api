const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostSongToPlaylistSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeleteSongsOnPlaylistSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PlaylistPayloadSchema,
  PostSongToPlaylistSchema,
  DeleteSongsOnPlaylistSchema,
};
