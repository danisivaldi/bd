var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function (req, res, next) {
    let query = "SELECT F.data_hora AS Data, F.local, SUM(J.gasto_energia) AS Gasto_Energia\
                 FROM Festas F, Festa_Jogos FJ, Jogos J\
                 WHERE F.id = FJ.festa_id AND FJ.jogo = J.nome\
                 GROUP BY F.data_hora, F.local";
    
    db.executeQuery(query, {}, {}, function (result) {
        res.send(result);
    });

    // res.render('index');
});

router.get('/testes', function (req, res, next) {
    res.render('testes');
});

router.post('/testes', function (req, res, next) {
    db.executeQuery(req.body.query, {}, {}, function (result) {
        res.render('testes', { result: result });
    });
});

module.exports = router;
