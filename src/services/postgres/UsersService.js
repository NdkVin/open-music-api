const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser(username, password, fullname) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hasedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) returning id',
      values: [id, username, hasedPassword, fullname],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0];
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Gagal menambahkan user. Username telah digunakan');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang anda masukan salah');
    }

    const { id, password: hasedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hasedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang anda masukan salah');
    }

    return id;
  }
}

module.exports = UsersService;
