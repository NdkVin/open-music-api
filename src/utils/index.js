/* eslint-disable camelcase */
const mapDbToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insert_at,
  update_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertAt: insert_at,
  updateAt: update_at,
});

module.exports = { mapDbToModel };
