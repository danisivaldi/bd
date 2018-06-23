var express = require('express');
var router = express.Router();
var db = require('../db');


/* GET home page. */
router.get('/', function(req, res, next) {
    // OBS.: callback é o código que será executado após rodar a query
    let query = 'SELECT * FROM Time WHERE saldo_gols > :saldo_gols';
    let params = { saldo_gols: 5 };
    let options = {};
    let callback = function(result) {
        res.render('index', { result: result });
    }

    db.executeQuery(query, params, options, callback);
});

module.exports = router;
