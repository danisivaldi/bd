var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();
var db = require('../db');
var moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
    let query = "SELECT id, TO_CHAR(data_hora, 'DD/MM/YYYY - HH24:MI') AS Horário, local, C.nome AS cliente, tipo FROM Festas JOIN Clientes C ON cliente = C.cpf";
    let params = {};
    let options = {};
    let callback = function (result) {
        res.render('festas/index', { result: result });
    }

    db.executeQuery(query, params, options, callback);
});

router.get('/new', function (req, res, next) {
    db.executeQuery('SELECT cpf, nome FROM Clientes', {}, {}, (result) => {
        console.log(result);
        
        res.render('festas/new', { clientes: result });
    });
});

router.get('/:id/edit', function (req, res, next) {
    db.executeQuery('SELECT cpf, nome FROM Clientes', {}, {}, (result) => {
        var clientes = result;

        let query = 'SELECT * FROM Festas WHERE id = :id';
        let params = {
            id: req.params.id
        };

        db.executeQuery(query, params, {}, function (result) {
            res.render('festas/edit', { festa: result.rows[0], clientes: clientes });
        });
    });
});

router.post('/', function (req, res, next) {
    let query = `INSERT INTO Festas VALUES (:data_hora, :local, :cliente, :tipo)`;
    let params = {
        data_hora: new Date(moment(`${req.body.data} ${req.body.horario}`, 'DD/MM/YYYY kk:mm').format()),
        local: req.body.local,
        cliente: req.body.cliente,
        tipo: req.body.tipo
    };
    let options = {
        autoCommit: true
    };

    db.executeQuery(query, params, options, function (result) {
        res.redirect('/festas');
    });
});

module.exports = router;
