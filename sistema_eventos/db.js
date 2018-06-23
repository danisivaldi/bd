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

oracledb.getConnection(config, (err, connection) => {
    if (err) {
        console.error(err.message);
        return;
    }

    connection.execute(
        `SELECT * FROM Time WHERE nome != :nome`,
        ['VASCO'],
        (err, result) => {
            if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
            }

            console.log(result);
            doRelease(connection);
        });

    console.log('Connection was successful!');

    doRelease(connection);
});
