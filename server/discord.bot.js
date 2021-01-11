const Discord = require('discord.js');
const { default: config } = require('./discord.config.js');
const cache = require('./cache.js');

const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

let guild;
let channel;

exports.start = () => {
  client.login(process.env.BOT_TOKEN).then(async () => {
    console.log(`Logged in as ${client.user.tag}`);

    guild = await (await client.guilds.fetch(config.guildId)).fetch();
    guild.members.fetch();
    channel = guild.channels.cache.get(config.channelId);
  });
};

exports.isUserPresent = (userTag) => {
  return (
    typeof guild.members.cache.find((member) => {
      return member.user.tag === userTag;
    }) !== 'undefined'
  );
};

exports.sendUserResume = async ({
  minecraft,
  discord,
  age,
  godfathers,
  discovery,
  resume,
}) => {
  const embed = new Discord.MessageEmbed()
    .setTitle(sanitize(minecraft))
    .setColor(config.waitingColor)
    .setThumbnail(await cache.getHeadUrl(minecraft))
    .setTimestamp()
    .addField('Âge', sanitize(age), true)
    .addField('Pseudo Discord', `<@${getUserId(discord)}>`, true)
    .addField(
      'Pseudo du/des Parrain(s)',
      godfathers === '' ? 'Non Renseigné' : sanitize(godfathers)
    )
    .addField(
      'Méthode de Découverte',
      discovery === '' ? 'Non Renseigné' : sanitize(discovery)
    )
    .addField('Candidature', '⬇')
    .setFooter(resume);

  channel.send(embed).then((msg) => {
    msg
      .react(config.refuseEmote)
      .then(() => msg.react(config.nullEmote))
      .then(() => msg.react(config.acceptEmote));
  });
};

const sanitize = (str) => {
  let result = str.replace('>', '\\>');
  result = result.replace('*', '\\*');
  result = result.replace('_', '\\_');
  result = result.replace('~', '\\~');
  result = result.replace('`', '\\`');
  result = result.replace('@', '\\@');
  return result;
};

const getUserId = (userTag) => {
  return client.users.cache.find((user) => {
    return user.tag === userTag;
  })?.id;
};
