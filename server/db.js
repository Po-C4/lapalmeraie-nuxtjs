const mysql = require('mysql');

const usernameRegex = /^[a-zA-Z0-9_]{1,16}$/;
const amountRegex = /^[0-9]+(?:.[0-9]{1,2})?$/;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
const table = process.env.DB_TABLE ? process.env.DB_TABLE : 'contributions';

exports.init = () => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `CREATE TABLE IF NOT EXISTS \`${table}\` (
        \`id\` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        \`username\` varchar(16) DEFAULT NULL,
        \`amount\` decimal(10,2) NOT NULL,
        \`timestamp\` datetime NOT NULL DEFAULT current_timestamp()
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`
    );
    connection.release();
  });
};

exports.logContribution = (username, amount) => {
  username = username.toLowerCase();
  if (!usernameRegex.test(username)) throw new Error('Invalid Username');
  if (!amountRegex.test(amount)) throw new Error('Invalid Amount');

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(`
      INSERT INTO \`${table}\` (username, amount)
      VALUES ('${username}', '${amount}')
    `);
    connection.release();
  });
};

exports.logAnonymousContribution = (amount) => {
  if (!amountRegex.test(amount)) throw new Error('Invalid Amount');

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(`INSERT INTO \`${table}\` (amount) VALUES ('${amount}')`);
    connection.release();
  });
};

exports.getTopVoters = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      connection.query(
        `SELECT \`votes\`.\`uuid\`, \`username\`, COUNT(\`votes\`.\`uuid\`) AS \`total\`
        FROM \`votes\` INNER JOIN \`players\` ON \`votes\`.\`uuid\` = \`players\`.\`uuid\`
        WHERE (\`timestamp\` BETWEEN DATE_FORMAT(CURRENT_TIMESTAMP, '%Y-%m-01') AND CURRENT_TIMESTAMP)
        GROUP BY \`username\` ORDER BY \`total\` DESC, \`timestamp\` DESC LIMIT 10`,
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
      connection.release();
    });
  });
};
