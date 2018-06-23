var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

const config = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  connectString: `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = ${process.env.DATABASE_HOST})(PORT = ${process.env.DATABASE_PORT}))(CONNECT_DATA =(SID= ${process.env.DATABASE_SID})))`
};

function doRelease(connection) {
  connection.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var queryResult;
  oracledb.getConnection(config, (err, connection) => {
    if (err) {
      console.error(err.message);
      return;
    }
    
    console.log('Connection was successful!');

    connection.execute(
      // `SELECT * FROM Time WHERE nome != :nome`,
      // ['VASCO'],
      `SELECT * FROM Time`, [],
      (err, result) => {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }

        queryResult = result;
        doRelease(connection);
        res.render('index', { result: queryResult });
      });
  });

});

module.exports = router;
