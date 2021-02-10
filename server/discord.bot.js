const Discord = require('discord.js');
const cache = require('./cache.js');
const configFile = require('./config.js');

const cosmetics = configFile.cosmetics;
const config =
  process.env.NODE_ENV === 'production'
    ? configFile.production
    : configFile.development;

const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

let guild;
const channels = {};

exports.start = () => {
  client.login(process.env.BOT_TOKEN).then(async () => {
    console.log(`Logged in as ${client.user.tag}`);

    guild = await (await client.guilds.fetch(config.guildId)).fetch();
    guild.members.fetch();

    for (const [key, value] of Object.entries(config.channels)) {
      channels[key] = guild.channels.cache.get(value);
    }
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
    .setColor(cosmetics.colors.waiting)
    .setThumbnail(await cache.getHeadUrl(minecraft))
    .setTimestamp()
    .addField(cosmetics.fields.age, sanitize(age), true)
    .addField(cosmetics.fields.discord, `<@${getUserId(discord)}>`, true)
    .addField(
      cosmetics.fields.godfathers,
      godfathers === '' ? cosmetics.fields.null : sanitize(godfathers)
    )
    .addField(
      cosmetics.fields.discovery,
      discovery === '' ? cosmetics.fields.null : sanitize(discovery)
    )
    .addField('Candidature', '⬇')
    .setFooter(resume);

  channels.newcomers.send(embed).then((msg) => {
    msg
      .react(cosmetics.emotes.deny)
      .then(() => msg.react(cosmetics.emotes.null))
      .then(() => msg.react(cosmetics.emotes.accept));
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
  if (
    reaction.message.channel.id !== config.channels.newcomers ||
    reaction.me
  ) {
    return;
  }

  await reaction.fetch();

  if (
    reaction.message.author.id === client.user.id &&
    reaction.message.embeds.length === 1
  ) {
    const embed = reaction.message.embeds[0];
    if (embed.hexColor === cosmetics.colors.waiting) {
      if (reaction.emoji.toString() === cosmetics.emotes.deny) {
        denyResume(reaction.message, embed, user);
      } else if (reaction.emoji.toString() === cosmetics.emotes.accept) {
        acceptResume(reaction.message, embed, user);
      }
    }
  }
});

const denyResume = (message, embed, judge) => {
  const userId = embed.fields
    .find((field) => field.name === cosmetics.fields.discord)
    .value.slice(2, -1);
  const user = guild.members.cache.get(userId);
  const username = embed.title;

  if (typeof user !== 'undefined') {
    user.createDM().then((dm) => {
      const responseEmbed = new Discord.MessageEmbed()
        .setColor(cosmetics.colors.denied)
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
    .setColor(cosmetics.colors.denied)
    .setAuthor(
      `${judge.tag} (${judge.id})`,
      judge.avatarURL({ dynamic: true })
    );

  message.edit(embed);
  message.reactions.removeAll();
};

const acceptResume = async (message, embed, judge) => {
  const userId = embed.fields
    .find((field) => field.name === cosmetics.fields.discord)
    .value.slice(2, -1);
  const user = guild.members.cache.get(userId);
  const username = embed.title;

  if (typeof user !== 'undefined') {
    user.createDM().then((dm) => {
      const responseEmbed = new Discord.MessageEmbed()
        .setColor(cosmetics.colors.accepted)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTitle('Candidature Acceptée')
        .setDescription(
          [
            `Bienvenue sur La Palmeraie **${username}**\nTu peux désormais te`,
            'connecter sur le serveur en utilisant cette adresse IP :',
            "`play.lapalmeraiemc.fr`\nNous te conseillons aussi d'aller voir",
            'notre tutoriel sur nos ajouts à cette adresse :',
            'https://lapalmeraiemc.fr/tutoriel',
          ].join(' ')
        );

      dm.send(responseEmbed);
    });

    user.roles.remove(config.roles.newcomer);
    user.roles.add(config.roles.member);
  }

  embed
    .setColor(cosmetics.colors.accepted)
    .setAuthor(
      `${judge.tag} (${judge.id})`,
      judge.avatarURL({ dynamic: true })
    );

  message.edit(embed);
  message.reactions.removeAll();
};
