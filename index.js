if (process.env.NODE_ENV != 'production') {
    require('dotenv').load();
}

// const express = require('express');
// const app = express();

// app.get('/', (req, res) =>
//     res.send('Hello World')
// );

// app.listen(3000, () =>
//     console.log('example app')
// );

const oracledb = require('oracledb');
const config = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    connectString: `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = ${process.env.DATABASE_HOST})(PORT = ${process.env.DATABASE_PORT}))(CONNECT_DATA =(SID= ${process.env.DATABASE_SID})))`
};

oracledb.getConnection(config, function (err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }

    console.log('Connection was successful!');

    connection.close(function (err) {
        if (err) {
            console.error(err.message);
            return;
        }
    });
});

async function getTime(timeId) {
    let conn;

    try {
        conn = await oracledb.getConnection(config);

        const result = await conn.execute(
            'SELECT * FROM Time WHERE nome = :id',
            [timeId]
        );

        console.log(result.rows[0]);
    } catch (err) {
        console.log('Ouch!', err);
    } finally {
        if (conn) { // conn assignment worked, need to close
            await conn.close();
        }
    }
}

getTime('VASCO');