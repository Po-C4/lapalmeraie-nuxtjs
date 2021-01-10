const discord = require('discord.js');
const { default: config } = require('./discord.config.js');

const client = new discord.Client({ partials: ['MESSAGE', 'REACTION'] });

let guild;

exports.start = () => {
  client.login(process.env.BOT_TOKEN).then(() => {
    console.log(`Logged in as ${client.user.tag}`);

    client.guilds.fetch(config.guildId).then((fetchedGuild) => {
      guild = fetchedGuild;
      guild.members.fetch();
    });
  });
};

exports.isUserPresent = (userTag) => {
  return (
    typeof guild.members.cache.find((member) => {
      return member.user.tag === userTag;
    }) !== 'undefined'
  );
};
