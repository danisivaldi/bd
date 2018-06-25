var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function (req, res, next) {
    let query = "SELECT TO_CHAR(F.data_hora, 'YYYY-MM') AS Periodo, SUM(J.gasto_energia) AS Gasto_Energia\
                FROM Festas F, Festa_Jogos FJ, Jogos J\
                WHERE F.id = FJ.festa_id AND FJ.JOGO = J.nome\
                GROUP BY TO_CHAR(F.DATA_HORA, 'YYYY-MM')";

    db.executeQuery(query, {}, {}, function (result) {
        res.render('index', { gastoEnergia: result.rows });
    });
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
