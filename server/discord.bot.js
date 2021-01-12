const Discord = require('discord.js');
const { default: config } = require('./discord.config.js');
const cache = require('./cache.js');

const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

let guild;
let channel;
let role;

exports.start = () => {
  client.login(process.env.BOT_TOKEN).then(async () => {
    console.log(`Logged in as ${client.user.tag}`);

    guild = await (await client.guilds.fetch(config.guildId)).fetch();
    guild.members.fetch();
    channel = guild.channels.cache.get(config.channelId);
    role = guild.roles.cache.get(config.roleId);
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
    .addField(config.fields.age, sanitize(age), true)
    .addField(config.fields.discord, `<@${getUserId(discord)}>`, true)
    .addField(
      config.fields.godfathers,
      godfathers === '' ? config.fields.null : sanitize(godfathers)
    )
    .addField(
      config.fields.discovery,
      discovery === '' ? config.fields.null : sanitize(discovery)
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

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.channel.id !== config.channelId || reaction.me) return;

  await reaction.fetch();

  if (
    reaction.message.author.id === client.user.id &&
    reaction.message.embeds.length === 1
  ) {
    const embed = reaction.message.embeds[0];
    if (embed.hexColor === config.waitingColor) {
      if (reaction.emoji.toString() === config.refuseEmote) {
        refuseResume(reaction.message, embed, user);
      } else if (reaction.emoji.toString() === config.acceptEmote) {
        acceptResume(reaction.message, embed, user);
      }
    }
  }
});

const refuseResume = (message, embed, judge) => {
  const userId = embed.fields
    .find((field) => field.name === config.fields.discord)
    .value.slice(2, -1);
  const user = guild.members.cache.get(userId);
  const username = embed.title;

  if (typeof user !== 'undefined') {
    user.createDM().then((dm) => {
      const responseEmbed = new Discord.MessageEmbed()
        .setColor(config.refusedColor)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTitle('Candidature Refusée')
        .setDescription(
          [
            `Désolé **${username}** mais nous avons le malheur de vous annoncer`,
            `que votre candidature à été refusée.\nPour plus d'informations`,
            `veuillez contacter <@${judge.id}>`,
          ].join(' ')
        );

      dm.send(responseEmbed);
    });
  }

  embed
    .setColor(config.refusedColor)
    .setAuthor(
      `${judge.tag} (${judge.id})`,
      judge.avatarURL({ dynamic: true })
    );

  message.edit(embed);
  message.reactions.removeAll();
};

const acceptResume = (message, embed, judge) => {
  const userId = embed.fields
    .find((field) => field.name === config.fields.discord)
    .value.slice(2, -1);
  const user = guild.members.cache.get(userId);
  const username = embed.title;

  if (typeof user !== 'undefined') {
    user.createDM().then((dm) => {
      const responseEmbed = new Discord.MessageEmbed()
        .setColor(config.acceptedColor)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTitle('Candidature Acceptée')
        .setDescription(
          [
            `Bienvenue sur La Palmeraie **${username}**\nTu peux désormais te`,
            'connecter sur le serveur en utilisant cette adresse IP :',
            "`play.lapalmeraiemc.fr`\nNous te conseillons aussi d'aller voir",
            'notre tutoriel sur nos ajouts à cette adresse :',
            'http://tuto.lapalmeraiemc.fr',
          ].join(' ')
        );

      dm.send(responseEmbed);
    });

    user.roles.add(role);
  }

  embed
    .setColor(config.acceptedColor)
    .setAuthor(
      `${judge.tag} (${judge.id})`,
      judge.avatarURL({ dynamic: true })
    );

  message.edit(embed);
  message.reactions.removeAll();
};
