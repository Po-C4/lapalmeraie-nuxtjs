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
