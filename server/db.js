const mysql = require('mysql');
const configFile = require('./config.js');

const config =
  process.env.NODE_ENV === 'production'
    ? configFile.production
    : configFile.development;

const usernameRegex = /^[a-zA-Z0-9_]{1,16}$/;
const uuidRegex = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
const amountRegex = /^[0-9]+(?:.[0-9]{1,2})?$/;
const transactionIdRegex = /^[a-zA-Z0-9._-]{17,20}$/;
const discordIdRegex = /^[0-9]{18}$/;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

exports.init = () => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `CREATE TABLE IF NOT EXISTS ?? (
        \`id\` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        \`uuid\` varchar(36) DEFAULT NULL,
        \`amount\` decimal(10,2) NOT NULL,
        \`transactionId\` varchar(20) NOT NULL,
        \`timestamp\` timestamp NOT NULL DEFAULT current_timestamp(),
        \`refunded\` boolean NOT NULL DEFAULT FALSE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
      [config.tables.contributions]
    );

    connection.query(
      `CREATE TABLE IF NOT EXISTS ?? (
        \`id\` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        \`uuid\` varchar(36) NOT NULL,
        \`service\` varchar(32) DEFAULT NULL,
        \`address\` int(10) UNSIGNED DEFAULT NULL,
        \`timestamp\` timestamp NOT NULL DEFAULT current_timestamp()
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
      [config.tables.votes]
    );

    connection.query(
      `CREATE TABLE IF NOT EXISTS ?? (
        \`uuid\` varchar(36) PRIMARY KEY NOT NULL,
        \`username\` varchar(16) NOT NULL,
        \`discordId\` varchar(18) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
      [config.tables.players]
    );

    connection.release();
  });
};

exports.logContribution = (uuid, amount, transactionId) => {
  if (!uuidRegex.test(uuid)) throw new Error('Invalid UUID');
  if (!amountRegex.test(amount)) throw new Error('Invalid Amount');
  if (!transactionIdRegex.test(transactionId)) {
    throw new Error('Invalid Transaction Id');
  }

  pool.query(
    'INSERT INTO ?? (`uuid`, `amount`, `transactionId`) VALUES (?, ?, ?)',
    [config.tables.contributions, uuid, amount, transactionId]
  );
};

exports.logAnonymousContribution = (amount, transactionId) => {
  if (!amountRegex.test(amount)) throw new Error('Invalid Amount');
  if (!transactionIdRegex.test(transactionId)) {
    throw new Error('Invalid Transaction Id');
  }

  pool.query('INSERT INTO ?? (`amount`, `transactionId`) VALUES (?, ?)', [
    config.tables.contributions,
    amount,
    transactionId,
  ]);
};

exports.getTopVoters = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT ??.\`uuid\`, \`username\`, COUNT(??.\`uuid\`) AS \`total\`
        FROM ?? INNER JOIN ?? ON ??.\`uuid\` = ??.\`uuid\`
        WHERE (\`timestamp\` BETWEEN DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-01') AND CURRENT_TIMESTAMP)
        GROUP BY \`username\` ORDER BY \`total\` DESC, \`timestamp\` DESC LIMIT 10`,
      [
        config.tables.votes,
        config.tables.votes,
        config.tables.votes,
        config.tables.players,
        config.tables.votes,
        config.tables.players,
      ],
      (err, res, fields) => {
        if (err) reject(err);
        res = res.map((v) => Object.assign({}, v));
        while (res.length < 10) {
          res.push({
            uuid: '00000000-0000-0000-0000-000000000000',
            username: 'N/A',
            total: 'N/A',
          });
        }
        resolve(res);
      }
    );
  });
};

exports.updatePlayer = (uuid, username, discordId) => {
  if (!uuidRegex.test(uuid)) throw new Error('Invalid UUID');
  if (!usernameRegex.test(username)) throw new Error('Invalid Username');
  if (!discordIdRegex.test(discordId)) throw new Error('Invalid Discord Id');

  pool.query(
    `INSERT INTO ?? (\`uuid\`, \`username\`, \`discordId\`)
    VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE discordId = ?`,
    [config.tables.players, uuid, username, discordId, discordId]
  );
};
