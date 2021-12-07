const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (e) => {
      console.log(e);
    });

    this._client.connect();
  }

  async set(key, value, expireInSecond = 3600) {
    await this._client.set(key, value, {
      EX: expireInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) {
      throw new Error('cache tidak ditemukan');
    }

    return result;
  }

  async delete(key) {
    const result = await this._client.del(key);
    return result;
  }
}

module.exports = CacheService;
