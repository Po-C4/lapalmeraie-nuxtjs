const NodeCache = require('node-cache');
const axios = require('axios');
const db = require('./db.js');

exports.cache = new NodeCache({ stdTTL: 1800 });
const endpoint = 'https://api.mojang.com/users/profiles/minecraft/';

const uuidRegex = /^([a-zA-Z0-9]{8})-?([a-zA-Z0-9]{4})-?([a-zA-Z0-9]{4})-?([a-zA-Z0-9]{4})-?([a-zA-Z0-9]{12})$/;

exports.fetchUuid = async (username) => {
  username = username.toLowerCase();
  let uuid = this.cache.get(username)?.uuid;
  if (typeof uuid === 'undefined') {
    const res = (await axios.get(`${endpoint}${username}`)).data;
    uuid = res.id;
    const capitalizedUsername = res.name;
    if (
      typeof uuid !== 'undefined' &&
      typeof capitalizedUsername !== 'undefined'
    ) {
      uuid = uuid.replace(uuidRegex, '$1-$2-$3-$4-$5');
      this.cache.set(username, { uuid, username: capitalizedUsername });
    }
  } else {
    this.cache.ttl(username);
  }
  return uuid;
};

exports.fetchCapitalizedUsername = async (username) => {
  username = username.toLowerCase();
  let capitalizedUsername = this.cache.get(username)?.username;
  if (typeof uuid === 'undefined') {
    const res = (await axios.get(`${endpoint}${username}`)).data;
    let uuid = res.id;
    capitalizedUsername = res.name;
    if (
      typeof uuid !== 'undefined' &&
      typeof capitalizedUsername !== 'undefined'
    ) {
      uuid = uuid.replace(uuidRegex, '$1-$2-$3-$4-$5');
      this.cache.set(username, { uuid, username: capitalizedUsername });
    }
  } else {
    this.cache.ttl(username);
  }
  return capitalizedUsername;
};

exports.playerExists = async (username) => {
  return typeof (await this.fetchUuid(username)) !== 'undefined';
};

exports.getHeadUrl = async (username) => {
  const uuid = await this.fetchUuid(username);
  if (typeof uuid === 'undefined') return undefined;
  return `https://crafatar.com/avatars/${uuid}?overlay`;
};

exports.getTopVoters = async () => {
  let topVoters = this.cache.get('top-voters');
  if (typeof topVoters === 'undefined') {
    topVoters = await db.getTopVoters();
    if (typeof topVoters !== 'undefined') {
      this.cache.set('top-voters', topVoters, 300);
    }
  }
  return { timestamp: this.cache.getTtl('top-voters') - 300 * 1000, topVoters };
};
