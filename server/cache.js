const NodeCache = require('node-cache');
const axios = require('axios');

exports.cache = new NodeCache({ stdTTL: 1800 });
const endpoint = 'https://api.mojang.com/users/profiles/minecraft/';

exports.fetchUuid = async (username) => {
  username = username.toLowerCase();
  let uuid = this.cache.get(username);
  if (typeof uuid === 'undefined') {
    uuid = (await axios.get(`${endpoint}${username}`)).data.id;
    if (typeof uuid !== 'undefined') this.cache.set(username, uuid);
  } else {
    this.cache.ttl(username);
  }
  return uuid;
};

exports.playerExists = async (username) => {
  return typeof (await this.fetchUuid(username)) !== 'undefined';
};

exports.getHeadUrl = async (username) => {
  const uuid = await this.fetchUuid(username);
  if (typeof uuid === 'undefined') return undefined;
  return `https://crafatar.com/avatars/${uuid}?overlay`;
};
