var oracledb = require('oracledb');

let db = {};

db.config = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    connectString: `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = ${process.env.DATABASE_HOST})(PORT = ${process.env.DATABASE_PORT}))(CONNECT_DATA =(SID= ${process.env.DATABASE_SID})))`
};

db.doRelease = function (connection) {
    connection.close((err) => {
        if (err) {
            console.error(err.message);
        }
    });
};

db.doConnect = function (callback) {
    oracledb.getConnection(db.config, callback);
};

db.executeQuery = function(query, params = {}, options = {}, cb) {
    if (typeof options['outFormat'] === 'undefined') {
        options['outFormat'] = oracledb.OBJECT;
    }

    db.doConnect((err, connection) => {
        if (err) {
            console.error(err.message);
            return;
        }

        connection.execute(
            query, params, options,
            (err, result) => {
                if (err) {
                    console.error(err.message);
                    db.doRelease(connection);
                    cb(err);
                    return;
                }

                db.doRelease(connection);
                cb(result);
            }
        );
    });
}

module.exports = db;